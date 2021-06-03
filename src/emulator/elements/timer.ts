import { EmulatorBitmap } from "../bitmap/bitmap";
import { EmulatorElement } from "../element";
import { EmulatorFontManager, FontType } from "../text/manager";

export class GameTimer extends EmulatorElement {

    private _timeMS: number = 0;

    get timeMS(): number {
        return this._timeMS;
    }

    get timeString(): string {
        let date = new Date(this.timeMS);
        return date.getMinutes() + ':' + 60 % date.getSeconds();
    }

    constructor(width: number) {
        super({
            offsetX: 0, offsetY: 20, zIndex: Infinity
        }, EmulatorBitmap.createEmpty(width, 20));
    }

    get bitmap() {
        let bitmap = new EmulatorBitmap(this._bitmap);
        bitmap = bitmap.blit(EmulatorFontManager.getFont(FontType.NormalBold).layout(this.timeString), bitmap.width/2, 0);
        return bitmap;
    }

}