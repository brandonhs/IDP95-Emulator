import { EmulatorBitmap } from '../bitmap/bitmap';
import { EmulatorElement, IElementTransform } from '../element';
import { EmulatorButton } from './button';
import * as EmulatorIcons from './icons';

export class EmulatorTaskBar extends EmulatorElement {

    private _elements: EmulatorElement[];

    constructor() {
        super({
            offsetX: 0, offsetY: 600-20, zIndex: Infinity
        }, EmulatorBitmap.createEmpty(800, 600).fill(18));
        this._elements = [];
    }

    handleMouseDrag(x: number, y: number, xoff: number, yoff: number) {

    }

    handleMouseDown(x: number, y: number) {
        
    }

    handleMouseUp(x: number, y: number) {
        
    }

    get bitmap() {
        var bitmap = new EmulatorBitmap(this._bitmap);
        for (let element of this._elements) {
            bitmap = bitmap.blit(element.bitmap, element.position.x, element.position.y);
        }
        return bitmap;
    }

}
