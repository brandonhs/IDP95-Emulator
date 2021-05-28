import { EmulatorBitmap } from './bitmap/bitmap';

export interface IElementTransform {
    offsetX: number,
    offsetY: number,
    zIndex: number,
}

export class EmulatorElement {

    public _bitmap: EmulatorBitmap;
    public _parent: EmulatorElement | null;
    protected _transform: IElementTransform;
    public onclick: () => void;

    constructor(transform: IElementTransform, bitmap: EmulatorBitmap = null, parent: EmulatorElement = null) {
        this._transform = transform;
        this._bitmap = bitmap || EmulatorBitmap.createEmpty();
        this._parent = parent;

        this.onclick = () => { }
    }

    setIndex(index: number) {
        this._transform.zIndex = index;
    }

    get position() : { x: number, y: number } {
        return {
            x: this._transform.offsetX,
            y: this._transform.offsetY
        };
    }

    containsMouse(x: number, y: number, parent: EmulatorElement = null) {
        if (parent == null) {
            parent = new EmulatorElement({
                offsetX: 0, offsetY: 0, zIndex: 0
            });
        }
        if (x >= this.position.x + parent.position.x && y >= this.position.y + parent.position.y && x <= this.position.x + parent.position.x + this.bitmap.width && y <= this.position.y + parent.position.y + this.bitmap.height) {
            return true;
        }
        return false;
    }

    handleMouseDown(x: number, y: number) {
        this.onclick();
    }

    handleMouseUp(x: number, y: number) {

    }

    handleMouseDrag(x: number, y: number, xoff: number, yoff: number) {

    }

    get bitmap() : EmulatorBitmap {
        return new EmulatorBitmap(this._bitmap);
    }

    set bitmap(newBitmap: EmulatorBitmap) {
        this._bitmap = new EmulatorBitmap(newBitmap);
    }

    get zIndex() : number {
        return this._transform.zIndex;
    }

    sort(other: EmulatorElement) : number {
        return this.zIndex >= other.zIndex ? 1 : -1;
    }

}