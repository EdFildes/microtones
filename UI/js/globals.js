let rootFreq = 1000

// document.getElementById("root-note-slider").innerHTML = `${Math.round(rootFreq)}Hz`

const ampEnvStore = new Map()
const oscStore = new Map()

const ratios = new Set()

const mapToRange = (input, in_min, in_max, out_min, out_max) => {
    return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

mapPitchToColour = (x, y, s = 100, l = 50) => {
    const scale = (Math.log2(x / y) * 360) + 60
    const hue = scale % 360
    return `hsl(${hue} ${s}% ${l}%)`
}

let socket

window.addEventListener("load", function () {

    // create websocket instance
    socket = new WebSocket("ws://localhost:8080/ws");

    // add event listener reacting to when message is received
    socket.onmessage = function (event) {
        console.log(event.data)
    };
});



