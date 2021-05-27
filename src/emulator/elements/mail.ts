import { EmulatorBitmap } from "../bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../element";
import { EmulatorFont } from "../text/font";
import { EmulatorButton } from "./button";

export interface IMailElementData {
    name: string,
    content: string,
    from: string,
    date: string,
}

export class MailElement extends EmulatorElement {

    private _name: string;
    private _content: string;
    private _from: string;
    private _date: string;

    constructor(data: IMailElementData, font: EmulatorFont, altFont: EmulatorFont, width: number, offset: number = 0) {
        super({offsetX: 0, offsetY: offset, zIndex: 1}, EmulatorBitmap.createEmpty(width, font.lineHeight*2 + altFont.lineHeight + 10).fill(39));

        this._name = data.name;
        this._content = data.content;
        this._from = data.from;
        this._date = data.date;

        let nameLayout = font.layout(this._name);
        let contentLayout = font.layout(this._content);
        let fromLayout = font.layout('From: ' + this._from);
        let dateLayout = altFont.layout(this._date);

        let offsetY = 5;
        this._bitmap = this._bitmap.blit(nameLayout, 25, offsetY);
        this._bitmap = this._bitmap.blit(contentLayout, 25, offsetY += nameLayout.height);
        this._bitmap = this._bitmap.blit(dateLayout, this.bitmap.width-100, offsetY);
        this._bitmap = this._bitmap.blit(fromLayout, 25, offsetY += contentLayout.height);
    }

}
