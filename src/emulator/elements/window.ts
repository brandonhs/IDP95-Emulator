import { EmulatorBitmap } from '../bitmap/bitmap';
import { EmulatorElement, IElementTransform } from '../element';
import { EmulatorFont } from '../text/font';
import { EmulatorFontManager, FontType } from '../text/manager';
import { EmulatorButton } from './button';
import * as EmulatorIcons from './icons';

export class EmulatorWindow extends EmulatorElement {

    private _elements: EmulatorElement[];

    private _closeElement: EmulatorButton;
    private _titleBarElement: EmulatorElement;
    private _titleFont: EmulatorFont;
    private _dragging: boolean;
    private _subWindows: EmulatorWindow[];

    private _titleBarHeight: number;

    onclose: () => void;

    constructor(transform: IElementTransform, width: number, height: number, title: string = 'Window') {
        super(transform, EmulatorBitmap.createEmpty(width, height));
        this._elements = [];
        this._subWindows = [];

        this._titleFont = EmulatorFontManager.getFont(FontType.Normal)
        var titleBarTitle = this._titleFont.layout(title);

        this._titleBarHeight = 20;

        this._titleBarElement = new EmulatorElement({
            offsetX: 0, offsetY: 0, zIndex: 20
        }, EmulatorBitmap.createEmpty(width, this._titleBarHeight).fill(252).blit(titleBarTitle, 10));

        this._closeElement = new EmulatorButton({
            offsetX: width - 20, offsetY: 0, zIndex: 20
        }, EmulatorIcons.Close.bitmapNormal, EmulatorIcons.Close.bitmapDown);

        this._elements.push(this._titleBarElement);
        this._elements.push(this._closeElement);

        this._dragging = false;

        this.onclose = () => { }
    }

    get subWindows() {
        return this._subWindows;
    }

    get titleBarHeight() {
        return this._titleBarHeight;
    }

    addChild(element: EmulatorElement) {
        if (element instanceof EmulatorWindow) {
            this._subWindows.push(element);
        } else {
            this._elements.push(element);
        }
    }

    containsMouseInTitleBar(x: number, y: number) : boolean {
        if (x >= this.position.x && y >= this.position.y && x <= this.position.x + this.bitmap.width && y <= this.position.y + this._titleBarHeight) {
            return true;
        }
        return false;
    }

    setBackground(image: EmulatorBitmap) {
        this._bitmap = image;
    }

    handleMouseDrag(x: number, y: number, xoff: number, yoff: number) {
        if (this._dragging) {
            this._transform.offsetX += xoff;
            this._transform.offsetY += yoff;
        }
    }

    handleMouseDown(x: number, y: number) {
        if (this.containsMouse(x, y)) {
            this.onclick();
        }
        if (this._closeElement.containsMouse(x, y, this)) {
            this._closeElement.handleMouseDown();
        }
        else if (this.containsMouseInTitleBar(x, y)) {
            this._dragging = true;
        }
        for (let element of this._elements) {
            if (element.containsMouse(x, y, this)) {
                element.handleMouseDown(x, y);
            }
        }
    }

    sendKey(key: string) {
        
    }

    handleMouseUp(x: number, y: number) {
        this._closeElement.handleMouseUp();
        if (this._closeElement.containsMouse(x, y, this)) {
            this.onclose();
        }
        this._dragging = false;
    }

    get bitmap() {
        var bitmap = new EmulatorBitmap(this._bitmap);
        for (let element of this._elements) {
            bitmap = bitmap.blit(element.bitmap, element.position.x, element.position.y);
        }
        return bitmap;
    }

}