let rootFreq = 1000

document.getElementById("root-note-slider").innerHTML = `${Math.round(rootFreq)}Hz`

const ampEnvStore = new Map()
const oscStore = new Map()

const ratios = new Set()

const mapToRange = (input, in_min, in_max, out_min, out_max)=> {
    return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}



