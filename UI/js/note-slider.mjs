let drag = false
let initialMousePosition
let initialSliderTop = 0


document.getElementById("root-note-slider-container").addEventListener("pointerdown", handleDragStart)
document.getElementById("root-note-slider-container").addEventListener("pointermove", handleNoteSlider)
document.getElementById("root-note-slider-container").addEventListener("pointerup", handleDragEnd)
document.getElementById("root-note-slider-container").addEventListener("mouseleave", handleDragEnd)


function handleDragStart(event) {
    const noteSlider = document.getElementById("root-note-slider")
    initialMousePosition = event.clientY
    initialSliderTop = Number(noteSlider.style.top.replace("px", "")) || 0

    drag = true
}

function handleNoteSlider(event) {
    if(drag){
        const noteSlider = document.getElementById("root-note-slider")
        const sliderContainer = document.getElementById("root-note-slider-container")
        const container = noteSlider.getBoundingClientRect()

        const distanceMouseMoved = event.clientY - initialMousePosition

        // constrain to slider container
        let newTop = Math.max(0, initialSliderTop + distanceMouseMoved)
        newTop = Math.min(newTop, sliderContainer.offsetHeight - container.height)

        const freq = mapToRange(newTop, 0, sliderContainer.offsetHeight - container.height, 100, 2000)

        noteSlider.innerHTML = `${Math.round(freq)}Hz`

        console.log("freq: ", rootFreq, "hz")

        rootFreq = freq;

        oscStore.entries().forEach(([ratios, osc]) => {
            const [x, y] = ratios.split(",")
            osc.frequency.rampTo(rootFreq * y/x, 1);
        })

        noteSlider.style.top = `${newTop}px`
    }
}

function handleDragEnd(event) {
    drag = false
}