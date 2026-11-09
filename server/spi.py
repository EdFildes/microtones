import spidev

spi = spidev.SpiDev()
# spi.open_path("/dev/spidev0.0")
# spi.max_speed_hz = 5000
# spi.mode = 0b01

def send_to_dac(transmission, channel):
    sequential_write_cmd = 0x60
    sequential_write_cmd |= (channel << 1);

    transmission |= (0x1 << 15) # vref bit (0x1 is internal voltage ref)
    transmission |= (0x00 << 13); # power down bits (0x00 is normal mode)
    transmission |= (0x1 << 12); # gain bit (0x1 is 2x gain)

    config_plus_val = transmission >> 8;
    val_continued = transmission & 0xFF;

    spi.xfer([sequential_write_cmd, config_plus_val, val_continued])

    print([sequential_write_cmd, config_plus_val, val_continued])