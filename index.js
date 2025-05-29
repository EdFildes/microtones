const gridSize = 20
const boxSize = "40px"
let rootFreq = document.getElementById("fundamental").value

document.getElementById("fundamental").addEventListener("change", (e => {
    rootFreq = e.target.value
}))

const ratios = new Set()

function mapPitchToColour(pitch){
    let octave = Math.trunc(pitch)
    const sign = Math.sign(octave)
    const cents = pitch - octave

    console.log(pitch, octave, cents)

    // // increase in pitch
    if(sign === 1){
        return `hsl(${cents/4}turn 100% ${50 + ((50/3) * octave)}%)`
    }
    // root octave
    if(sign === 0){
        return `hsl(${cents/4}turn 100% 50%)`
    }

    // lower pitch
    else if(sign === -1){
        octave = octave * -1
        return `hsl(${cents/4}turn 100% ${50 - ((50/3) * octave)}%)`
    }
}

// effects chain
const reverb = new Tone.Reverb(3).toDestination()
reverb.wet = 0.5
const comp = new Tone.Compressor(-30, 3).connect(reverb);


document.body.onload = createGrid;

function addTone(y, x, box) {
    if(!box.isActive){
        box.osc = new Tone.Oscillator(rootFreq * y/x, "sine").connect(comp).start();
        box.isActive = true;
        box.style.border = "black solid 4px";
    } else {
        box.osc.stop();
        box.isActive = false;
        box.style.border = "white solid 1px";
    }
}

function createGrid() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid"
    wrapper.style.gridTemplateColumns = `repeat(${gridSize}, ${boxSize})`
    wrapper.style.gridTemplateRows = `repeat(${gridSize}, ${boxSize})`

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