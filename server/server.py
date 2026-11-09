import asyncio
import json
import spi

from websockets.asyncio.server import serve



MAX_CHANNELS = 3


channel_register = {}
channels_in_use = 0


async def communicate_with_microtones(websocket):
    while True:
        message = await websocket.recv()
        print(f"<<< {message}")
        try:
            data = json.loads(message) 
            if data["event"] == "note_on" and len(channel_register) < MAX_CHANNELS:
                channel = len(channel_register) + 1
                channel_register[data["note"]] = channel
                # spi.send_to_dac(data["frequency"], channel)
                await websocket.send(f"Note on -> channel {channel}")

            elif data["event"] == "note_off" and data["note"] in channel_register:
                channel = channel_register[data["note"]]
                # spi.send_to_dac(0, channel)
                del channel_register[data["note"]]
                await websocket.send(f"Note off -> channel {channel}")

        except json.decoder.JSONDecodeError:
            print("Recieved invalid JSON")  

async def main():
    server = await serve(communicate_with_microtones, "localhost", 8080)
    await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())