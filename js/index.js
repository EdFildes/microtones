// const gridSize = 20
// const boxSize = "40px"
let rootFreq =  500 //document.getElementById("fundamental").value

// document.getElementById("fundamental").addEventListener("change", (e => {
//     rootFreq = e.target.value
// }))

const mapToRange = (input, in_min, in_max, out_min, out_max)=> {
  return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const ratios = new Set()


function mapPitchToColour(pitch){
    let octave = Math.floor(pitch)
    const sign = Math.sign(octave)
    const cents = Math.abs(Math.trunc(pitch) - pitch)
    const totalRange = 360 // over 11 octaves?

    // console.log(pitch, octave, cents)

    const mapping = mapToRange(cents, 0, 1, 174, 242)

    // // increase in pitch
    if(sign === 1){
        return `hsl(${mapping} 100% ${50 + ((50/3) * octave)}%)`
    }
    // root octave
    if(sign === 0){
        return `hsl(${mapping} 100% 50%)`
    }

    // lower pitch
    else if(sign === -1){
        octave = octave * -1
        return `hsl(${mapping} 100% ${50 - ((50/3) * octave)}%)`
    }
}

// effects chain 
const reverb = new Tone.Reverb(3).toDestination()
reverb.wet = 0.5
const comp = new Tone.Compressor(-30, 3).connect(reverb);

const ampEnvStore = new Map()

function handleTone(y, x, element) {
    if(!element.classList.contains("active")){
        const ampEnv = new Tone.AmplitudeEnvelope({
            "attack": 0.4,
            "decay": 0.4,
            "sustain": 1.0,
            "release": 1.0
        }).connect(comp);
        ampEnvStore.set(`${x},${y}`, ampEnv)
        console.log("freq: ", rootFreq * y/x, "hz")
        new Tone.Oscillator(rootFreq * y/x, "sine").connect(ampEnv).start();
        ampEnv.triggerAttack();
        element.classList.add("active")
    } else {
        // box.osc.stop();
        const ampEnv = ampEnvStore.get(`${x},${y}`)
        ampEnv.triggerRelease();
        ampEnvStore.delete(`${x},${y}`)
        element.classList.remove("active")
    }
}

function createPlayableGrid(gridSize, parentId) {
    const parent = document.getElementById(parentId)
    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            let gridItem = document.createElement("div");
            gridItem.classList.add("grid-item")

            // Number axis
            if(y === 0 || x == 0){
                gridItem.classList.add("axis-label")
                gridItem.innerHTML = x || y || ""
            } else if(ratios.has(y/x)){
                gridItem.classList.add("unplayable")
            } else {
                gridItem.classList.add("playable")
                gridItem.style.backgroundColor = mapPitchToColour(Math.log2(y/x))
                gridItem.addEventListener("click", () => handleTone(y,x, gridItem))
                ratios.add(y/x)
            }

            parent.appendChild(gridItem)
        }
    }
}

function createGrid(cols, rows, remove, parentId, config = {}) {
    const parent = document.getElementById(parentId)
    for(let i=remove; i < ((cols * rows)); i++){
        let gridItem = document.createElement("div");
        gridItem.classList.add("grid-item")
        if(config[i]){
            itemConfig = config[i]
            gridItem.classList.add(`item-${i}`)
        }
        
        parent.appendChild(gridItem)
    }
}


function createSpectrum() {
    const spectrumContainer = document.getElementById("spectrum_container");
    const spectrum = document.createElement("div");
    spectrum.style.height = `${root.offsetWidth}px`;
    spectrum.style.width = "100px"
    spectrumContainer.appendChild(spectrum);
    spectrum.style.background = `linear-gradient(to top, hsl(174 100% 50%), hsl(242 100% 50%))`;
}

createGrid(1, 8, 0, "root-note")
createPlayableGrid(9, "play-grid")
createGrid(2, 8, 0, "octave-chart")
