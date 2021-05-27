import { EmulatorFont } from "./font";

export enum FontType {
    Normal, NormalBold, Large, LargeBold
}

export interface IManagedFont {
    font: EmulatorFont,
    type: FontType
}

export class EmulatorFontManager {

    private static _fonts: IManagedFont[] = [];

    static getFont(type: FontType) {
        return this._fonts.find((font) => font.type === type).font;
    }

    static addFont(type: FontType, font: EmulatorFont) {
        this._fonts.push({
            type, font
        });
    }

}
