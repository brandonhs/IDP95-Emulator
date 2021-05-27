import { EmulatorBitmap } from "./bitmap/bitmap";

import * as paletteJson from '../../assets/palette.json';

const createCanvas = () => {
    var canvas = document.createElement('canvas');
    canvas.id = 'idp95-emulator';
    document.body.appendChild(canvas);
    return canvas;
}

export interface IBitmapColorData {
    colorId: number,
    hexString: string,
    rgb: {
        r: number,
        g: number,
        b: number,
    },
    hsl: {
        h: number,
        s: number,
        l: number,
    };
    name: string,
}

export type IBitmapPalette = IBitmapColorData[];

export interface IBitmapRendererSettings {
    width: number,
    height: number,
}

export class BitmapRenderer {

    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _cachedBitmap: EmulatorBitmap;
    palette: IBitmapPalette;

    constructor(palette: IBitmapPalette, settings: IBitmapRendererSettings = {
        width: 640, height: 480,
    }) {
        this.palette = palette;
        this._canvas = createCanvas();
        this.canvas.width = settings.width;
        this.canvas.height = settings.height;
        this._ctx = this.canvas.getContext('2d');
        this._ctx.imageSmoothingEnabled = false;
        this._cachedBitmap = null;
    }

    get canvas() {
        return this._canvas;
    }

    get ctx() {
        return this._ctx;
    }

    static loadPalette(): IBitmapPalette {
        var palette = new Array<IBitmapColorData>(256);
        for (let i = 0; i < palette.length; i++) {
            var paletteData = <IBitmapColorData>paletteJson[i];
            palette[i] = paletteData;
        }
        return palette;
    }

    render(bitmap: EmulatorBitmap, sx = 0, sy = 0, w = bitmap.width - sx, h = bitmap.height - sy) {
        var imageArray = new Uint8ClampedArray(w*h*4);
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let i = (x+sx) + (y+sy) * bitmap.width;
                let i1 = x + y * w;
                var colorIndex = bitmap.bitmap[i];
                var mask = bitmap.mask[i];
                var color = this.palette.find((value: IBitmapColorData) => {
                    return value.colorId === colorIndex
                });
                var rgb = color.rgb;
                var a = 255;
                imageArray[i1 * 4 + 0] = rgb.r;
                imageArray[i1 * 4 + 1] = rgb.g;
                imageArray[i1 * 4 + 2] = rgb.b;
                imageArray[i1 * 4 + 3] = a;
            }
        }
        var imageData = new ImageData(imageArray, w);
        this.ctx.putImageData(imageData, sx, sy);
    }

    render_fast(bitmap: EmulatorBitmap) {
        let w = bitmap.width;
        let h = bitmap.height;
        if (!this._cachedBitmap) {
            this._cachedBitmap = EmulatorBitmap.createEmpty(bitmap.width, bitmap.height);
        }
        
        let sx = w-1, sy = h-1;
        let cw = 0, ch = 0;
        var foundA = false;
        var foundB = false;
        for (let x = w; x > 0; x--) {
            for (let y = h; y > 0; y--) {
                let i = (x) + (y) * bitmap.width;
                var colorIndex = bitmap.bitmap[i];
                var cachedIndex = this._cachedBitmap.bitmap[i];
                if (x <= sx && y <= sy) {
                    if (colorIndex !== cachedIndex) {
                        sx = x;
                        sy = y;
                        foundA = true;
                    }
                } else if (x >= cw && y >= ch) {
                    if (colorIndex !== cachedIndex) {
                        cw = x;
                        ch = y;
                        foundB = true;
                    }
                }
                
            }
        }

        if (cw-sx <= 0 || ch-sy <= 0) return;
        if (!(foundA && foundB)) return;
        
        this.render(bitmap, sx+1, sy+1, cw-sx-1, ch-sy-1);
        // this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(sx+2, sy+2);
        this.ctx.lineTo(cw, ch);
        this.ctx.stroke();
        this._cachedBitmap = new EmulatorBitmap(bitmap);
    }

    renderPixel(bitmap: EmulatorBitmap, x: number, y: number) {
        var imageArray = new Uint8ClampedArray(4);
        let i = x + y * bitmap.width;
        let colorIndex = bitmap.bitmap[i];
        var color = this.palette.find((value: IBitmapColorData) => {
            return value.colorId === colorIndex
        });
        var rgb = color.rgb;
        imageArray[0] = rgb.r;
        imageArray[1] = rgb.g;
        imageArray[2] = rgb.b;
        imageArray[3] = 255;
        var imageData = new ImageData(imageArray, 1);
        this.ctx.putImageData(imageData, x, y);
    }

}

export class EmulatorPaletteView {

    constructor(root_el: HTMLElement, palette: IBitmapPalette, onidchange: (id: number) => void) {

        let svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let maxWidth = 350;
        svgRoot.setAttribute('width', '' + maxWidth);
        svgRoot.setAttribute('height', '' + palette.length);
        root_el.appendChild(svgRoot);

        let selectedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        selectedRect.setAttribute('width', '10');
        selectedRect.setAttribute('height', '10');
        selectedRect.setAttribute('x', '0');
        selectedRect.setAttribute('y', '0');
        svgRoot.appendChild(selectedRect);

        let x = 0;
        let y = 12;
        for (let col of palette) {
            if (x > maxWidth) {
                x = 0;
                y += 10;
            }

            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', '10');
            rect.setAttribute('height', '10');
            rect.setAttribute('x', '' + x);
            rect.setAttribute('y', '' + y);
            rect.setAttribute('fill', col.hexString);
            rect.setAttribute('id', '' + col.colorId);

            rect.onclick = function() {
                let colorID = parseInt(rect.id);
                onidchange(colorID);
                selectedRect.setAttribute('fill', col.hexString);
            }

            svgRoot.appendChild(rect);

            x += 10;
        }
    }

}
