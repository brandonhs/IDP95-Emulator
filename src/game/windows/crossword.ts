import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../../emulator/element";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";
import { IBitmapPalette } from "../../emulator/renderer";
import { getImage, getSvg } from "../../utils/requests";

import crosswordSvgUrl from '../../../assets/crossword2.svg';
import { Emulator } from "../../emulator/emulator";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";
import { EmulatorFont } from "../../emulator/text/font";

export class CrosswordHints extends EmulatorElement {

    constructor(transform: IElementTransform, width: number, hintsAcross: string[], hintsDown: string[]) {
        let labelFont = EmulatorFontManager.getFont(FontType.NormalBold);
        let hintFont = EmulatorFontManager.getFont(FontType.Normal);
        super(transform, EmulatorBitmap.createEmpty(width, (hintsDown.length + hintsAcross.length) * hintFont.lineHeight + 2 * labelFont.lineHeight));

        let acrossLabel = labelFont.layout('Across');
        let offsetY = 0;
        this._bitmap = this._bitmap.blit(acrossLabel, 0, offsetY);
        offsetY += labelFont.lineHeight;
        let n = 1;
        for (let across of hintsAcross) {
            let acrossLayout = hintFont.layout('    ' + across);
            this._bitmap = this._bitmap.blit(acrossLayout, 0, offsetY);
            offsetY += hintFont.lineHeight;
            n++;
        }
        
        let downLabel = labelFont.layout('Down');
        this._bitmap = this._bitmap.blit(downLabel, 0, offsetY);
        offsetY += labelFont.lineHeight;
        n = 1;
        for (let down of hintsDown) {
            let downLayout = hintFont.layout('    ' + down);
            this._bitmap = this._bitmap.blit(downLayout, 0, offsetY);
            offsetY += hintFont.lineHeight;
            n++;
        }

    }

}

export class CrosswordBox extends EmulatorElement {

    private _col: number;
    private _row: number;
    private _text: string;
    private _font: EmulatorFont;
    public index: number;
    public selected: boolean;

    constructor(x: number, y: number, width: number, height: number, col: number, row: number, index: number) {
        super({
            offsetX: x, offsetY: y, zIndex: 10
        }, EmulatorBitmap.createEmpty(width, height).fill(15));
        this._col = col;
        this._row = row;

        this.index = index;

        this.selected = false;

        this._font = EmulatorFontManager.getFont(FontType.NormalBold);

        this._text = '';
    }

    set text(newText) {
        this._text = newText;
    }

    get bitmap() {
        var bitmap = new EmulatorBitmap(this._bitmap).fill(this.selected ? 40 : 15);
        var data = this._font.getCharacterData(this.text.charAt(0));
        if (data) {
            bitmap = bitmap.blit(this._font.layout(this._text).replace(15, 0), Math.floor(this._bitmap.width/2-data.width/2), Math.floor(this._bitmap.height/2-this._font.lineHeight/2));
        }
        return bitmap;
    }

    get text() {
        return this._text;
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

    private _selectedIndex: number;

    private _letters: string[][];
    private _letterWidth: number;
    private _maxIndex: number;
    private _boxIndices: number[];

    constructor(transform: IElementTransform, crosswordSvg: XMLDocument) {
        var svg = crosswordSvg.getElementsByTagName('svg')[0];
        var width = Math.floor(parseFloat(svg.getAttribute('data-width')));
        var height = Math.floor(parseFloat(svg.getAttribute('data-height')));

        super(transform, width, height+20, 'Crossword');
        
        // this._hintsWindow = new EmulatorWindow({
        //     offsetX: 10, offsetY: 10, zIndex: 20
        // }, 400, 200, 'Crossword Hints!');
        
        // this._crosswordHints = new CrosswordHints({
        //     offsetX: 0, offsetY: this.titleBarHeight, zIndex: 0
        // }, this._hintsWindow.bitmap.width, [
        //     '2. What was pacman\'s original name?',
        //     '4. What is full of holes but still holds water?',
        //     '5. What goes up when rain comes down?',
        //     '6. What do you bury alive and dig up when dead?',
        // ], [
        //     '1. What word is always pronounced incorrectly?',
        //     '3. What color is pacman?',
        // ]);
        
        // this._hintsWindow.addChild(this._crosswordHints);
        
        // emulator.addElement(this._hintsWindow);
        
        let maxRow = 0;
        let maxCol = 0;

        this._boxIndices = [];
        
        let elements = crosswordSvg.getElementsByTagName('g');
        let font = EmulatorFontManager.getFont(FontType.NormalBold);
        let i: number;
        for (i = 0; i < elements.length; i++) {
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
            
            let boxElement = new CrosswordBox(x, y+this.titleBarHeight, w, h, col, row, i);
            boxElement.onclick = () => {
                if (this._selectedBox) {
                    this._selectedBox.selected = false;
                }
                boxElement.selected = true;
                this._selectedBox = boxElement;
                this._selectedIndex = this._elements.indexOf(boxElement);
            }
            this._boxIndices.push(this._elements.length-1);
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

        this._maxIndex = i;

        this._letterWidth = maxCol;
        this._letters = 
            new Array(maxRow+1).fill(null).map(() => 
            new Array(maxCol+1).fill(null).map(() => ' '));
    }

    sendKey(key: string, dif=2) {
        if (this._selectedBox) {
            if (key.length <= 1) {
                this._letters[this._selectedBox.row][this._selectedBox.col] = key;
                this._selectedBox.selected = false;
                this._selectedBox.text = key;
                this._selectedIndex = this._elements.indexOf(this._selectedBox)+dif;
                if (this._selectedIndex <= 0) {
                    this._selectedIndex = this._elements.findIndex((element) => {
                        if (element instanceof CrosswordBox) {
                            return element.index === this._maxIndex-1;
                        }
                        return false;
                    });
                }
                if (this._selectedIndex >= this._elements.length) {
                    this._selectedIndex = this._elements.findIndex((element) => {
                        if (element instanceof CrosswordBox) {
                            return element.index === 0;
                        }
                        return false;
                    });
                }
                this._selectedBox = <CrosswordBox>this._elements[this._selectedIndex];
                this._selectedBox.selected = true;
                let res = '';
                for (let row = 0; row < this._letters.length; row++) {
                    for (let col = 0; col < this._letters[row].length; col++) {
                        res += this._letters[row][col] || ' ';
                    }
                    res += '\n';
                }
                console.log(res);
            } else if (key.match('Backspace')) {
                var last = this._letters[this._selectedBox.row][this._selectedBox.col] === ' ';
                if (last || this._letters[this._selectedBox.row][this._selectedBox.col].length === 0) {
                    this.sendKey(' ', -2);
                    this.sendKey(' ', 0);
                } else {
                    this.sendKey('', 0);
                }
            } else if (key === 'ArrowLeft') {
                this.sendKey(this._letters[this._selectedBox.row][this._selectedBox.col] || ' ', -2);
            } else if (key === 'ArrowRight') {
                this.sendKey(this._letters[this._selectedBox.row][this._selectedBox.col] || ' ', 2);
            }
        }
    }

    static async create(transform: IElementTransform) {
        var crosswordImage = await getSvg(crosswordSvgUrl);
        return new CrosswordWindow(transform, crosswordImage);
    }

}
