import { EmulatorBitmap } from '../bitmap/bitmap';
import { EmulatorElement, IElementTransform } from '../element';
import { EmulatorFont } from '../text/font';
import { EmulatorFontManager, FontType } from '../text/manager';
import { EmulatorButton } from './button';
import { IMailElementData, MailElement } from './mail';

export class EmulatorInbox extends EmulatorElement {

    private _elements: MailElement[];

    constructor(transform: IElementTransform, elements: IMailElementData[], width: number) {
        super(transform, EmulatorBitmap.createEmpty(width, 400));

        this._elements = [];
        let offsetY = 0;
        for (let data of elements) {
            let el = new MailElement(data, EmulatorFontManager.getFont(FontType.Normal), EmulatorFontManager.getFont(FontType.NormalBold), this._bitmap.width, offsetY);
            this._elements.push(el);
            offsetY += el.bitmap.height + 5;
        }
    }

    handleMouseDown(x: number, y: number) {
        for (let element of this._elements) {
            if (element.containsMouse(x, y, this)) {
                element.handleMouseDown(x, y);
            }
        }
    }

    handleMouseUp(x: number, y: number) {
        for (let element of this._elements) {
            element.handleMouseUp(x, y);
        }
    }

    get bitmap() {
        var bitmap = new EmulatorBitmap(this._bitmap);
        for (let element of this._elements) {
            bitmap = bitmap.blit(element.bitmap, element.position.x, element.position.y);
        }
        return bitmap;
    }

}