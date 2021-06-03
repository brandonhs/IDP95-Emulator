import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../../emulator/element";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";

export class Demontavious extends EmulatorElement {

    private _text: string;

    constructor(transform: IElementTransform) {
        super(transform, EmulatorBitmap.createEmpty(20, 20).fill(9));

        this._text = '';
    }

    get bitmap() {
        var bitmap = new EmulatorBitmap(this._bitmap);
        bitmap = bitmap.blit(EmulatorFontManager.getFont(FontType.NormalBold).layout(this._text));
        return bitmap;
    }

    speak(text: string) {
        this._text = text;
    }

}
