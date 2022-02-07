import { TextSystem } from "./core/TextClasses.js"

export function setupText() {
    // Make Text Systems and add them to the scene.

    var tsconfig1 = {
        buttonText: "N",
        popoutText: "Nopety",
        popoutOffset: [2, 1, 1],
        position: [0, -2, 0],
    }

    var ts1 = new TextSystem(tsconfig1);

}