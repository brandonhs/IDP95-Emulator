import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../../emulator/element";
import { EmulatorWindow } from "../../emulator/elements/window";
import { EmulatorFont } from "../../emulator/text/font";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";

export class TerminalLine extends EmulatorElement {

    private _font: EmulatorFont;
    private _text: string;
    
    constructor(width: number, offsetY: number) {
        var font = EmulatorFontManager.getFont(FontType.NormalBold);
        super({
            offsetX: 0, offsetY: offsetY*font.lineHeight+20, zIndex: 1,
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
        var bitmap = new EmulatorBitmap(this._bitmap);
        bitmap = bitmap.blit(this._font.layout(this._text, 40));
        return bitmap;
    }

}

export class EmulatorTerminal extends EmulatorWindow {

    private _lines: TerminalLine[];
    private _line: number = 0;

    constructor(transform: IElementTransform) {
        super(transform, 500, 400, 'Terminal');

        this._lines = [];
        for (let i = 0; i < 10; i++) {
            this._lines.push(new TerminalLine(500, i));
            this.addChild(this._lines[i]);
        }
    }

    write(text: string) {
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            this._lines[this._line].text += lines[i];
            this._line++;
        }
        this._line--;
    }

}
