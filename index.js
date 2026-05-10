// const gridSize = 20
// const boxSize = "40px"
// let rootFreq = document.getElementById("fundamental").value

// document.getElementById("fundamental").addEventListener("change", (e => {
//     rootFreq = e.target.value
// }))

// const mapToRange = (input, in_min, in_max, out_min, out_max)=> {
//   return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
// }

// const ratios = new Set()


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

function addTone(y, x, box) {
    if(!box.isActive){
        const ampEnv = new Tone.AmplitudeEnvelope({
            "attack": 0.4,
            "decay": 0.4,
            "sustain": 1.0,
            "release": 1.0
        }).connect(comp);
        ampEnvStore.set(`${x},${y}`, ampEnv)
        box.osc = new Tone.Oscillator(rootFreq * y/x, "sine").connect(ampEnv).start();
        box.isActive = true;
        box.style.border = "black solid 4px";
        ampEnv.triggerAttack();
    } else {
        // box.osc.stop();
        const ampEnv = ampEnvStore.get(`${x},${y}`)
        ampEnv.triggerRelease();
        box.isActive = false;
        box.style.border = "white solid 1px";
        ampEnvStore.delete(`${x},${y}`)
    }
}

function _createGrid() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid"
    wrapper.style.gridTemplateColumns = `repeat(${gridSize}, ${boxSize})`
    wrapper.style.gridTemplateRows = `repeat(${gridSize}, ${boxSize})`
    wrapper.style.columnGap = "5px";
    wrapper.style.rowGap = "5px";

    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            const box = document.createElement("div");
            box.style.height = boxSize;
            box.style.width = boxSize;
            box.style.textAlign = "center";
            // x axis
            if(y === 0){
                x && (box.innerHTML = x)
                box.style.padding = "18px 0"
            } else if(x === 0){
                y && (box.innerHTML = y)
                box.style.padding = "18px 0"
            } else {
                box.style.border = "white solid 1px";
                box.style.borderStyle = "inset";
                if(ratios.has(y/x)){
                    box.style.backgroundColor = "grey"
                } else {
                    box.isActive = false;
                    box.style.backgroundColor = mapPitchToColour(Math.log2(y/x))
                    box.onclick = () => addTone(y,x, box); 
                    ratios.add(y/x)
                }
            }
            wrapper.appendChild(box)
        }
    }
    const root = document.getElementById("root")
    root.appendChild(wrapper)
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


createGrid(2, 9, 0, "root-note")
createGrid(9, 9, 0, "play-grid")
createGrid(2, 9, 0, "octave-chart")
