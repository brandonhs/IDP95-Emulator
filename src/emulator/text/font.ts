import { EmulatorBitmap } from '../bitmap/bitmap';

import { getImage, makeRequest } from '../../utils/requests';
import { IBitmapPalette } from '../renderer';

export interface ICharacterData {
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    xoffset: number,
    yoffset: number,
    xadvance: number,
    page: number,
    chnl: number,
}

export interface IFontInfo {
    face: string,
    size: number,
    bold: number,
    italic: number,
    charset: string,
    unicode: number,
    stretchH: number,
    smooth: number,
    aa: number,
    padding: number[],
    spacing: number[],
    outline: number,
}

export interface ICommonData {
    lineHeight: number,
    base: 13,
    scaleW: 256,
    scaleH: 256,
    pages: number,
    packed: number,
    alphaChnl: number,
    redChnl: number,
    greenChnl: number,
    blueChnl: number,
}

export interface IKerning {

}

export interface IFont {
    pages: string[],
    chars: ICharacterData[],
    common: ICommonData,
    kernings: IKerning[],
    info: IFontInfo,
}

export class EmulatorFont {

    private _bitmap: EmulatorBitmap;
    private _fontData: IFont;

    constructor(fontData: IFont, bitmap: EmulatorBitmap) {
        this._bitmap = bitmap;
        this._fontData = fontData;
    }

    getCharacterData(char: string) {
        return this._fontData.chars.find((c) => {
            return String.fromCharCode(c.id) == char;
        })
    }

    get lineHeight() {
        return this._fontData.common.lineHeight;
    }

    layout(text: string) {
        let characters: ICharacterData[] = [];
        let totalWidth = 0;
        let height = this._fontData.common.lineHeight;
        for (let char of text) {
            let data = this.getCharacterData(char);
            if (data) {
                characters.push(data);
                totalWidth += data.xadvance;
            }
        }
        let bitmap = EmulatorBitmap.createEmpty(totalWidth, height);

        let offsetX = 0;
        for (let data of characters) {
            let glyph = this._bitmap.getRegion(data.x, data.y, data.width, data.height);
            bitmap = bitmap.blit(glyph, offsetX, data.yoffset);
            offsetX += data.xadvance;
        }
        bitmap.applyTransparentColorFilter(0);
        return bitmap;
    }

    static async loadFont(fontData: IFont, palette: IBitmapPalette) {
        let imageUrl = require('../../../assets/' + fontData.pages[0]).default;
        let image = await getImage(imageUrl);
        return new EmulatorFont(fontData, EmulatorBitmap.loadImageFromHTML(image, palette));
    }

}
