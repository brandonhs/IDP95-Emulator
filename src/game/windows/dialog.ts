import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement } from "../../emulator/element";
import { EmulatorWindow } from "../../emulator/elements/window";
import { EmulatorFont } from "../../emulator/text/font";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";

export class DialogLine extends EmulatorElement {

    private _font: EmulatorFont;
    private _text: string;
    
    constructor(width: number, i: number) {
        var font = EmulatorFontManager.getFont(FontType.NormalBold);
        super({
            offsetX: 100, offsetY: Math.floor(75/2)+i*font.lineHeight, zIndex: 1,
        }, EmulatorBitmap.createEmpty(width, font.lineHeight));
        this._font = font;


        this._text = '';
    }

    set text(text: string) {
        this._text = text;
    }

    get text() {
        return this._text;
    }

    get bitmap() {
        var bitmap = new EmulatorBitmap(this._bitmap).replace(0, 15);
        var text = this._font.layout(this._text).replace(15, 124);
        bitmap = bitmap.blit(text);
        this._transform.offsetX = 100 - Math.floor(text.width/2);
        return bitmap;
    }

}

export class DialogWindow extends EmulatorWindow {

    private _lines: DialogLine[];

    constructor(text: string) {
        var width = 200, height = 150;
        super({
            offsetX: emulator.bitmap.width / 2 - width/2, offsetY: emulator.bitmap.height / 2 - height/2, zIndex: Infinity
        }, width, height, 'Demontavious Says');

        this._bitmap.replace(0, 15);

        let lines = text.split('\n');
        this._lines = [];
        console.log(lines);
        for (let i = 0; i < lines.length; i++) {
            this._lines.push(new DialogLine(width, i));
            console.log(lines[i]);
            this._lines[i].text = lines[i];
            this.addChild(this._lines[i]);
        }
    }

}