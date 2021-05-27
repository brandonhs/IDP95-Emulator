import { BitmapRenderer, IBitmapColorData, IBitmapPalette } from "../renderer";

export interface IBitmapSettings {
    width: number,
    height: number,
}

interface StringColor {
    [key: string]: number
}

export interface IBitmapData {
    width: number,
    height: number,
    bitmap: StringColor,
    mask: StringColor,
}

export class EmulatorBitmap {

    public bitmap: Uint8Array;
    public mask: Uint8Array;

    private _width: number;
    private _height: number;

    constructor(settings: IBitmapSettings | EmulatorBitmap) {
        if (settings instanceof EmulatorBitmap) {
            this._width = settings.width;
            this._height = settings.height;
            this.bitmap = Uint8Array.from(settings.bitmap);
            this.mask = Uint8Array.from(settings.mask);
        } else {
            this._width = settings.width;
            this._height = settings.height;
            this.bitmap = new Uint8Array(this.width * this.height);
            this.mask = new Uint8Array(this.width * this.height);
            this.mask.fill(0);
        }
    }

    static createEmpty(width=64, height=480) : EmulatorBitmap {
        return new EmulatorBitmap({ width: width, height: height });
    }

    static loadImage(data: ArrayBuffer) {
        var width = 0;
        var height = 0;
        var view = new DataView(data);
        width = view.getUint32(0);
        height = view.getUint32(4);
        console.log(width);

        var dataSection = new DataView(data.slice(8));
        var bitmapData = new Uint8Array(width * height);
        var maskData = new Uint8Array(width * height);
        if (dataSection.getUint8(0) === 0x3a) {
            for (let i = 1; i < bitmapData.length+1; i++) {
                bitmapData[i-1] = dataSection.getUint8(i);
                maskData[i-1] = dataSection.getUint8(i+bitmapData.length);
            }
        }

        var bitmap = EmulatorBitmap.createEmpty(width, height);
        bitmap.bitmap = bitmapData;
        bitmap.mask = maskData;
        return bitmap;
    }

    getRegion(offsetX: number, offsetY: number, width: number, height: number) {
        width = Math.min(this.width, width)+offsetX;
        height = Math.min(this.height, height)+offsetY;
        var bitmap = EmulatorBitmap.createEmpty(width-offsetX, height-offsetY);
        for (let x = offsetX; x < width; x++) {
            for (let y = offsetY; y < height; y++) {
                let i = x + y * this.width;
                let i2 = (x - offsetX) + (y-offsetY) * (width-offsetX);
                bitmap.bitmap[i2] = this.bitmap[i];
                bitmap.mask[i2] = this.mask[i];
            }
        }
        return bitmap;
    }

    static loadImageFromHTML(image: HTMLImageElement, palette: IBitmapPalette) {
        var canvas = new OffscreenCanvas(image.width, image.height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        var imgData = ctx.getImageData(0, 0, image.width, image.height);
        return EmulatorBitmap.loadImageFromImageData(imgData, palette);
    }

    static loadImageFromImageData(image: ImageData, palette: IBitmapPalette) {
        var bitmap = EmulatorBitmap.createEmpty(image.width, image.height);
        for (let i = 0; i < image.data.length; i+=4) {
            var r = image.data[i + 0];
            var g = image.data[i + 1];
            var b = image.data[i + 2];

            let totalDif = 1000;
            let color = palette[0];
            palette.forEach((value: IBitmapColorData) => {
                let dif = Math.abs(value.rgb.r - r);
                dif += Math.abs(value.rgb.g - g);
                dif += Math.abs(value.rgb.b - b);
                if (dif < totalDif) {
                    totalDif = dif;
                    color = value;
                }
            });

            bitmap.bitmap[i/4] = color.colorId;
        }
        return bitmap;
    }

    private _lineLow(x1: number, y1: number, x2: number, y2: number, color: number, size: number, renderer: BitmapRenderer = null) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let yi = 1;
        if (dy < 0) {
            yi = -1;
            dy = -dy;
        }
        let D = (2 * dy) - dx;
        let y = y1;
        for (let x = x1; x < x2; x++) {
            this.fill(color, x-size/2, y-size/2, size, size);
            if (renderer) {
                renderer.render(this, x-size/2, y-size/2, size, size);
            }
            if (D > 0) {
                y += yi;
                D += 2 * (dy - dx);
            } else {
                D += 2 * dy;
            }
        }
    }

    private _lineHigh(x1: number, y1: number, x2: number, y2: number, color: number, size: number, renderer: BitmapRenderer = null) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let xi = 1;
        if (dx < 0) {
            xi = -1;
            dx = -dx;
        }
        let D = (2 * dx) - dy;
        let x = x1;
        for (let y = y1; y < y2; y++) {
            this.fill(color, x-Math.ceil(size/2), y-Math.ceil(size/2), size, size);
            if (renderer) {
                renderer.render(this, x-size/2, y-size/2, size, size);
            }
            if (D > 0) {
                x += xi;
                D += 2 * (dx - dy);
            } else {
                D += 2 * dx;
            }
        }
    }

    line(x1: number, y1: number, x2: number, y2: number, color: number, size: number, renderer: BitmapRenderer = null) {
        if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {
            if (x1 > x2)
                this._lineLow(x2, y2, x1, y1, color, size, renderer);
            else
                this._lineLow(x1, y1, x2, y2, color, size, renderer);
        }
        else {
            if (y1 > y2)
                this._lineHigh(x2, y2, x1, y1, color, size, renderer);
            else
                this._lineHigh(x1, y1, x2, y2, color, size, renderer);
        }
        return this;
    }

    exportBitmap() {
        var data = new ArrayBuffer(this.width*this.height*2+8+1);
        var view = new DataView(data);

        view.setUint32(0, this.width);
        view.setUint32(4, this.height);

        view.setUint8(8, 0x3a);
        for (let i = 0; i < this.bitmap.length; i++) {
            view.setUint8(i+9, this.bitmap[i]);
            view.setUint8(i+9+this.bitmap.length, this.mask[i]);
        }

        return data;
    }

    createFlippedVertical() {
        var bitmap = new EmulatorBitmap(this);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let i1 = x + y * this.width;
                let i2 = x + (this.height - y) * this.width;
                bitmap.bitmap[i1] = this.bitmap[i2];
            }
        }
    }

    createFlippedHorizontal() {
        // TODO
    }

    rotate(degrees: number) {
        // TODO
    }

    applyTransparentColorFilter(colors: number[] | number) {
        if (typeof colors === 'number') {
            colors = [colors];
        }
        for (let i = 0; i < this.mask.length; i++) {
            for (let color of colors) {
                if (this.bitmap[i] === color) {
                    this.mask[i] = 1;
                } else {
                    this.mask[i] = 0;
                }
            }
        }
        return this;
    }

    fill(color: number, offsetX = 0, offsetY = 0, width = this.width, height = this.height) {
        if (color < 0 || color > 255) {
            throw new Error('Color to fill must be within the range of 0 to 255');
        }
        width = Math.min(this.width, width)+offsetX;
        height = Math.min(this.height, height)+offsetY;
        for (let x = offsetX; x < width; x++) {
            for (let y = offsetY; y < height; y++) {
                let i = x + y * this.width;
                this.bitmap[i] = color;
            }
        }
        return this;
    }

    setPixel(x: number, y: number, color: number) {
        // comm mat theme darker higher
        let index = x + y * this.width;
        this.setPixelIndex(index, color);
    }

    setPixelIndex(index: number, color: number) {
        if (color < 0 || color > 255) {
            throw new Error('Color to fill must be within the range of 0 to 255');
        }
        this.bitmap[index] = color;
    }

    blit(other: EmulatorBitmap, offsetX: number = 0, offsetY: number = 0) {
        var width = Math.min(this.width, other.width);
        var height = Math.min(this.height, other.height);
        var bitmap = new EmulatorBitmap(this);
        for (let x = 0; x < width; x++) {
            if (x + offsetX >= this.width || x + offsetX < 0) {
                continue;
            }
            for (let y = 0; y < height; y++) {
                let i1 = (x + offsetX) + (y + offsetY) * this.width;
                let i2 = x + y * other.width;
                bitmap.bitmap[i1] &= other.mask[i2]*255;
                bitmap.bitmap[i1] |= other.bitmap[i2];
            }
        }
        return bitmap;
    }

    replace(color: number, h: number) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let i = x + y * this.width;
                if (this.bitmap[i] === color) {
                    this.bitmap[i] = h;
                }
            }
        }
        return this;
    }

    fillMask(n: number) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let i = x + y * this.width;
                this.mask[i] = n;
            }
        }
        return this;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

}
