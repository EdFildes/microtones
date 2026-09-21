import {createHorizontalLine, createVerticalLine, createText, createDisabled, createPressable} from "./components.mjs";

function mapPitchToColour(x, y, s=100){
    const scale = (Math.log2(x/y) * 360) + 60
    const hue = scale % 360
    return `hsl(${hue} ${s}% 50%)`
}

function createPlayableGrid(gridSize) {
    const parent = document.getElementById("play-grid");
    const svg = document.getElementById("play-grid-svg");
    const columnSize = parent.offsetWidth / gridSize;
    let grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let squares = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (let y = 0; y < gridSize; y++){
        createVerticalLine(grid, columnSize * (y + 1), parent.offsetHeight)
        createHorizontalLine(grid, parent.offsetHeight, columnSize * (y + 1))
        
        for (let x = 0; x < gridSize; x++){
            if(y === 0 || x == 0){
                createText(squares, (x || y || ""), (x * columnSize) + columnSize * 0.35, (y * columnSize) + columnSize * 0.7);
            } else if (ratios.has(y/x)) {
                const fill = mapPitchToColour(x, y, 50);
                createDisabled(squares, columnSize, x * columnSize, y * columnSize, fill);
            } else {
                ratios.add(y/x);
                const fill = mapPitchToColour(x, y);
                createPressable(squares, columnSize, x * columnSize, y * columnSize, fill);
            }
        }
    }
    svg.appendChild(squares);
    svg.appendChild(grid);
}

function createGrid(cols, rows, parentId, config = {}) {
    const parent = document.getElementById(parentId)
    for(let i=0; i < ((cols * rows)); i++){
        let gridItem = document.createElement("div");
        gridItem.classList.add("grid-item")
        gridItem.classList.add(`${parentId}-child-${i}`)
        if(config[i]){
            itemConfig = config[i]
            gridItem.classList.add(`item-${i}`)
        }
        
        parent.appendChild(gridItem)
    }
}

createGrid(1, 8, "root-note")
createPlayableGrid(9, "play-grid-svg")
createGrid(2, 8, "octave-chart")
