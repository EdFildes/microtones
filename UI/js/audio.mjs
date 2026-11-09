// effects chain 
const reverbConfig = {
    wet: 0.9,
    decay: 5,
}

const envelopeConfig = {
    "attack": 0.4,
    "decay": 0.4,
    "sustain": 1.0,
    "release": 1.0
}

const reverb = new Tone.Reverb(3).toDestination().set(reverbConfig);
const comp = new Tone.Compressor(-30, 3).connect(reverb);

export function handleTone(y, x, element) {
    if (!element.classList.contains("active")) {
        const frequency = rootFreq * y / x
        const ampEnv = new Tone.AmplitudeEnvelope(envelopeConfig).connect(comp);
        ampEnvStore.set(`${x},${y}`, ampEnv)

        const osc = new Tone.Oscillator(frequency, "sine").connect(ampEnv).start();
        oscStore.set(`${x},${y}`, osc)

        ampEnv.triggerAttack();

        if (socket) {
            socket.send(JSON.stringify({ "event": "note_on", "note": `${x},${y}`, "frequency": frequency }))
        }

        element.classList.add("active")
        console.log("Note ON:", frequency, "hz")

    } else {
        // box.osc.stop();
        const ampEnv = ampEnvStore.get(`${x},${y}`)
        ampEnv.triggerRelease();

        ampEnvStore.delete(`${x},${y}`)
        oscStore.delete(`${x},${y}`)

        if (socket) {
            socket.send(JSON.stringify({ "event": "note_off", "note": `${x},${y}` }))
        }

        element.classList.remove("active")
        console.log("Note OFF:", rootFreq * y / x, "hz")
    }
}