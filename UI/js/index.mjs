import { createHorizontalLine, createVerticalLine, createText, createDisabled, createPressable } from "./components.mjs";

function createPlayableGrid(gridSize) {
    const parent = document.getElementById("play-grid");
    const svg = document.getElementById("play-grid-svg");
    const columnSize = parent.offsetWidth / gridSize;
    let grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let squares = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let y = 0; y < gridSize; y++) {
        createVerticalLine(grid, columnSize * (y + 1), parent.offsetHeight)
        createHorizontalLine(grid, parent.offsetHeight, columnSize * (y + 1))

        for (let x = 0; x < gridSize; x++) {
            if (y === 0 || x == 0) {
                createText(squares, (x || y || ""), (x * columnSize) + columnSize * 0.35, (y * columnSize) + columnSize * 0.7);
            } else if (ratios.has(y / x)) {
                const fill = mapPitchToColour(x, y, 50);
                createDisabled(squares, columnSize, x, y, fill);
            } else {
                ratios.add(y / x);
                const fill = mapPitchToColour(x, y);
                createPressable(squares, columnSize, x, y, fill);
            }
        }
    }
    svg.appendChild(squares);
    svg.appendChild(grid);
}

function createGrid(cols, rows, parentId, config = {}) {
    const parent = document.getElementById(parentId)
    const svg = document.getElementById("play-grid-svg");
    const columnSize = parent.offsetWidth / gridSize;
    let grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let squares = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let i = 0; i < ((cols * rows)); i++) {
        createVerticalLine(grid, columnSize * (y + 1), parent.offsetHeight)
        createHorizontalLine(grid, parent.offsetHeight, columnSize * (y + 1))
        // let gridItem = document.createElement("div");
        // gridItem.classList.add("grid-item")
        // gridItem.classList.add(`${parentId}-child-${i}`)
        // if(config[i]){
        //     itemConfig = config[i]
        //     gridItem.classList.add(`item-${i}`)
        // }

        // parent.appendChild(gridItem)
    }
}

function createFreqSliderGrid(rows, parentId, config = {}) {
    const parent = document.getElementById(parentId)
    const svg = document.getElementById(`${parentId}-container`);
    const columnSize = parent.offsetHeight / rows;
    let grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let squares = document.createElementNS("http://www.w3.org/2000/svg", "g");
    createVerticalLine(grid, parent.offsetWidth / 2, parent.offsetHeight)
    for (let i = 0; i < rows; i++) {

        createHorizontalLine(grid, parent.offsetHeight, columnSize * (i + 1))
        // let gridItem = document.createElement("div");
        // gridItem.classList.add("grid-item")
        // gridItem.classList.add(`${parentId}-child-${i}`)
        // if(config[i]){
        //     itemConfig = config[i]
        //     gridItem.classList.add(`item-${i}`)
        // }

        // parent.appendChild(gridItem)
    }
    svg.appendChild(grid);
}

createFreqSliderGrid(9, "root-note")
createPlayableGrid(9, "play-grid-svg")
createFreqSliderGrid(9, "octave-chart")
