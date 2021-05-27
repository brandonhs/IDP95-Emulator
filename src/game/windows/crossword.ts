import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../../emulator/element";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";
import { IBitmapPalette } from "../../emulator/renderer";
import { getImage, getSvg } from "../../utils/requests";

import crosswordImageUrl from '../../../assets/crossword.png';
import crosswordSvgUrl from '../../../assets/crossword.svg';
import { Emulator } from "../../emulator/emulator";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";

export class CrosswordHints extends EmulatorElement {

    constructor(transform: IElementTransform, width: number, hintsDown: string[], hintsAcross: string[]) {
        let labelFont = EmulatorFontManager.getFont(FontType.NormalBold);
        let hintFont = EmulatorFontManager.getFont(FontType.Normal);
        super(transform, EmulatorBitmap.createEmpty(width, (hintsDown.length + hintsAcross.length) * hintFont.lineHeight + 2 * labelFont.lineHeight));

        let acrossLabel = labelFont.layout('Across');
        let offsetY = 0;
        this._bitmap = this._bitmap.blit(acrossLabel, 0, offsetY);
        offsetY += labelFont.lineHeight;
        let n = 1;
        for (let across of hintsAcross) {
            let acrossLayout = hintFont.layout('    ' + n + '. ' + across);
            this._bitmap = this._bitmap.blit(acrossLayout, 0, offsetY);
            offsetY += hintFont.lineHeight;
            n++;
        }
        
        let downLabel = labelFont.layout('Down');
        this._bitmap = this._bitmap.blit(downLabel, 0, offsetY);
        offsetY += labelFont.lineHeight;
        n = 1;
        for (let down of hintsDown) {
            let downLayout = hintFont.layout('    ' + n + '. ' + down);
            this._bitmap = this._bitmap.blit(downLayout, 0, offsetY);
            offsetY += hintFont.lineHeight;
            n++;
        }

    }

}

export class CrosswordBox extends EmulatorElement {

    private _col: number;
    private _row: number;

    constructor(x: number, y: number, width: number, height: number, col: number, row: number) {
        super({
            offsetX: x, offsetY: y, zIndex: 10
        }, EmulatorBitmap.createEmpty(width, height).fill(15));
        this._col = col;
        this._row = row;
    }

    get col() {
        return this._col;
    }

    get row() {
        return this._row;
    }

}

export interface ILetterData {
    x: number, y: number, w: number, h: number, letter: string
}

export class CrosswordWindow extends EmulatorWindow {

    private _hintsWindow: EmulatorWindow;
    private _crosswordHints: CrosswordHints;
    private _selectedBox: CrosswordBox;

    private _letters: string[];
    private _letterWidth: number;

    constructor(transform: IElementTransform, crosswordSvg: XMLDocument) {
        var svg = crosswordSvg.getElementsByTagName('svg')[0];
        var width = Math.floor(parseFloat(svg.getAttribute('data-width')));
        var height = Math.floor(parseFloat(svg.getAttribute('data-height')));

        super(transform, width, height+20, 'Crossword');
        
        
        this._hintsWindow = new EmulatorWindow({
            offsetX: 10, offsetY: 10, zIndex: 20
        }, 400, 200, 'Crossword Hints!');
        
        this._crosswordHints = new CrosswordHints({
            offsetX: 0, offsetY: this.titleBarHeight, zIndex: 0
        }, this._hintsWindow.bitmap.width, [
            'What goes up when rain comes down?',
            'What is full of holes but still holds water?',
            'What was pacman\'s original name?',
            'What color is pacman?',
        ], [
            'What do you bury alive and dig up when dead?',
            'What word is always pronounced incorrectly?',
        ]);
        
        this._hintsWindow.addChild(this._crosswordHints);
        
        emulator.addElement(this._hintsWindow);
        
        let maxRow = 0;
        let maxCol = 0;
        
        let elements = crosswordSvg.getElementsByTagName('g');
        let font = EmulatorFontManager.getFont(FontType.NormalBold);
        for (let i = 0; i < elements.length; i++) {
            let g = elements[i];
            let rect = g.getElementsByTagName('rect')[0];
            let x = parseInt(rect.getAttribute('x'))+2;
            let y = parseInt(rect.getAttribute('y'))+2;
            let w = parseInt(rect.getAttribute('width'))-2;
            let h = parseInt(rect.getAttribute('height'))-2;
            let id: string[] | string = g.id;
            id = id.split('-');
            let row = parseInt(id[1]);
            let col = parseInt(id[2]);
            
            maxCol = Math.max(col, maxCol);
            maxRow = Math.max(row, maxRow);
            
            let boxElement = new CrosswordBox(x, y+this.titleBarHeight, w, h, col, row);
            boxElement.onclick = () => {
                this._selectedBox = boxElement;
            }
            this.addChild(boxElement);
            
            let text = g.getElementsByTagName('text')[0];
            var content = text.textContent;
            let textX = parseInt(text.getAttribute('x'));
            let textY = parseInt(text.getAttribute('y'));
            let data = font.getCharacterData(content.charAt(0));
            let textHeight = font.lineHeight;
            if (data) {
                textHeight = data.height;
            }
            let numberElement = new EmulatorElement({
                offsetX: textX+1, offsetY: textY + Math.floor(textHeight/2) + 8 + 1, zIndex: 11
            }, font.layout(content).replace(15, 8));
            this.addChild(numberElement);
        }

        this._letterWidth = maxCol;
        this._letters = new Array(maxCol * maxRow);
    }

    sendKey(key: string) {
        let font = EmulatorFontManager.getFont(FontType.NormalBold);
        if (this._selectedBox) {
            let index = this._selectedBox.col + this._selectedBox.row * this._letterWidth;
            this._letters[index] = key;
            console.log(this._letters);
        }
    }
    
    static async create(transform: IElementTransform) {
        var crosswordImage = await getSvg(crosswordSvgUrl, crosswordImageUrl);
        return new CrosswordWindow(transform, crosswordImage.element);
    }

}
