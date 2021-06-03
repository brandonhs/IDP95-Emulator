import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { IElementTransform } from "../../emulator/element";
import { EmulatorButton } from "../../emulator/elements/button";
import { EmulatorWindow } from "../../emulator/elements/window";
import { Emulator } from "../../emulator/emulator";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";

export class StartWindow extends EmulatorWindow {

    private _startButton: EmulatorButton;

    constructor(startButtonImage: EmulatorBitmap, emulator: Emulator = globalThis.emulator) {
        super({
            offsetX: emulator.bitmap.width/2 - 300, offsetY: emulator.bitmap.height/2 - 200, zIndex: 100
        }, 600, 400, 'Escape Room!', true);

        this._startButton = new EmulatorButton({
            offsetX: this.bitmap.width/2 - startButtonImage.width/2, offsetY: this.bitmap.height/2 - startButtonImage.height/2, zIndex: 0
        }, startButtonImage);
        this.addChild(this._startButton);

        this._startButton.onclick = () => {
            emulator.next();
        }
    }

}