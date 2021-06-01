import { EmulatorBitmap } from '../bitmap/bitmap';
import { EmulatorElement, IElementTransform } from '../element';

export class EmulatorButton extends EmulatorElement {

    protected _bitmapNormal: EmulatorBitmap;
    protected _bitmapDown: EmulatorBitmap;

    public id: number;

    protected _isClicked: boolean;
    protected _selected: EmulatorBitmap;

    constructor(transform: IElementTransform, bitmapNormal: EmulatorBitmap, bitmapDown: EmulatorBitmap = bitmapNormal) {
        super(transform, bitmapNormal);
        this._bitmapNormal = bitmapNormal;
        this._bitmapDown = bitmapDown;
        this._isClicked = false;
        this._selected = this._bitmapNormal;
        this.id = 0;
    }

    handleMouseDown() {
        this.onclick();
        this._isClicked = true;
        this._selected = this._bitmapDown;
    }

    handleMouseUp() {
        this._isClicked = false;
        this._selected = this._bitmapNormal;
    }

    get bitmap() {
        return this._selected;
    }

}