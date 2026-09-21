// effects chain 
const reverb = new Tone.Reverb(3).toDestination();
reverb.set({
    wet: 0.9,
    decay: 5,
});
const comp = new Tone.Compressor(-30, 3).connect(reverb);

export function handleTone(y, x, element) {
    if(!element.classList.contains("active")){
        const ampEnv = new Tone.AmplitudeEnvelope({
            "attack": 0.4,
            "decay": 0.4,
            "sustain": 1.0,
            "release": 1.0
        }).connect(comp);
        ampEnvStore.set(`${x},${y}`, ampEnv)
        const osc = new Tone.Oscillator(rootFreq * y/x, "sine").connect(ampEnv).start();
        oscStore.set(`${x},${y}`, osc)
        ampEnv.triggerAttack();
        element.classList.add("active")
        console.log("freq: ", rootFreq * y/x, "hz")
    } else {
        // box.osc.stop();
        const ampEnv = ampEnvStore.get(`${x},${y}`)
        ampEnv.triggerRelease();
        ampEnvStore.delete(`${x},${y}`)
        oscStore.delete(`${x},${y}`)
        element.classList.remove("active")
    }
}