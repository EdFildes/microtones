import {handleTone} from "./audio.mjs";

export const createHorizontalLine = (parent, x, y) => {
    const hozLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hozLine.setAttribute("x1", 0);
    hozLine.setAttribute("y1", y);
    hozLine.setAttribute("x2", x);
    hozLine.setAttribute("y2", y);
    hozLine.setAttribute("stroke", "white");
    parent.appendChild(hozLine);
}

export const createVerticalLine = (parent, x, y) => {
    const vertLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vertLine.setAttribute("x1", x);
    vertLine.setAttribute("y1", 0);
    vertLine.setAttribute("x2", x);
    vertLine.setAttribute("y2", y);
    vertLine.setAttribute("stroke", "white");
    parent.appendChild(vertLine);
}

export const createText = (parent, contents, x, y) => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
    text.classList.add("axis-label")
    text.setAttribute("stroke", "white")
    text.setAttribute("fill", "black")
    text.setAttribute("x", x)
    text.setAttribute("y", y)
    text.innerHTML = contents
    parent.appendChild(text)
}


const createSvgElement = (type, attrs = {}) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", type);
    Object.entries(attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
    })
    return element
}

const createInnerShadow = (filter) => {

    const blur = 4;

    filter.append(
        createSvgElement("feFlood", {
            "flood-opacity": "0",
            result: "BackgroundImageFix",
        }),

        createSvgElement("feBlend", {
            mode: "normal",
            in: "SourceGraphic",
            in2: "BackgroundImageFix",
            result: "shape",
        }),

        createSvgElement("feColorMatrix", {
            in: "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
            result: "hardAlpha",
        }),

        createSvgElement("feOffset", {
            dx: "10",
        }),

        createSvgElement("feGaussianBlur", {
            stdDeviation: blur,
        }),

        createSvgElement("feComposite", {
            in2: "hardAlpha",
            operator: "arithmetic",
            k2: "-1",
            k3: "1",
        }),

        createSvgElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
        }),

        createSvgElement("feBlend", {
            mode: "normal",
            in2: "shape",
            result: "effect1_innerShadow_117_408",
        }),

        createSvgElement("feColorMatrix", {
            in: "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
            result: "hardAlpha",
        }),

        createSvgElement("feOffset", {
            dx: "-10",
        }),

        createSvgElement("feGaussianBlur", {
            stdDeviation: blur,
        }),

        createSvgElement("feComposite", {
            in2: "hardAlpha",
            operator: "arithmetic",
            k2: "-1",
            k3: "1",
        }),

        createSvgElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0",
        }),

        createSvgElement("feBlend", {
            mode: "normal",
            in2: "effect1_innerShadow_117_408",
            result: "effect2_innerShadow_117_408",
        }),

        createSvgElement("feColorMatrix", {
            in: "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
            result: "hardAlpha",
        }),

        createSvgElement("feOffset", {
            dy: "10",
        }),

        createSvgElement("feGaussianBlur", {
            stdDeviation: blur,
        }),

        createSvgElement("feComposite", {
            in2: "hardAlpha",
            operator: "arithmetic",
            k2: "-1",
            k3: "1",
        }),

        createSvgElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0",
        }),

        createSvgElement("feBlend", {
            mode: "normal",
            in2: "effect2_innerShadow_117_408",
            result: "effect3_innerShadow_117_408",
        }),

        createSvgElement("feColorMatrix", {
            in: "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
            result: "hardAlpha",
        }),

        createSvgElement("feOffset", {
            dy: "-10",
        }),

        createSvgElement("feGaussianBlur", {
            stdDeviation: blur,
        }),

        createSvgElement("feComposite", {
            in2: "hardAlpha",
            operator: "arithmetic",
            k2: "-1",
            k3: "1",
        }),

        createSvgElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0",
        }),

        createSvgElement("feBlend", {
            mode: "normal",
            in2: "effect3_innerShadow_117_408",
            result: "effect4_innerShadow_117_408",
        })
    );

}

export const createPressable = (parent, size, x, y, fill) => {
    const filterId = `filter_${x}_${y}`
    const svg = createSvgElement("svg");
    const g = createSvgElement("g", {filter: `url(#${filterId})`});
    const rect = createSvgElement("rect", { x: x, y: y, width: size, height: size, fill });
    const defs = createSvgElement("defs");
    const filter = createSvgElement("filter", { id: filterId, filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB", });

    createInnerShadow(filter);

    rect.classList.add("playable")
    rect.classList.add("grid-item")
    rect.addEventListener("click", () => handleTone(y,x, filter));

    g.appendChild(rect);
    defs.appendChild(filter);
    svg.appendChild(g);
    svg.append(defs);
    parent.appendChild(svg);
}

export const createDisabled = (parent, size, x, y, fill) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.classList.add("grid-item")
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", size)
    rect.setAttribute("height", size)
    rect.setAttribute("fill", fill);
    rect.classList.add("unplayable");
    parent.appendChild(rect);
}