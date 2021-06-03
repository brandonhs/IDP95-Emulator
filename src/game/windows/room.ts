import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../../emulator/element";
import { EmulatorButton } from "../../emulator/elements/button";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";
import { Emulator } from "../../emulator/emulator";
import { IBitmapPalette } from "../../emulator/renderer";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";
import { getImage } from "../../utils/requests";
import { CrosswordWindow } from "./crossword";

export interface IRoomImages {
    background: EmulatorBitmap,
    umbrella: EmulatorBitmap,
    carpet: EmulatorBitmap,
    painting: EmulatorBitmap,
    plant: EmulatorBitmap,
    desk: EmulatorBitmap,
    supplies: EmulatorBitmap,
}

export interface ITopImages {
    umbrella: EmulatorBitmap,
    carpet: EmulatorBitmap,
    painting: EmulatorBitmap,
    plant: EmulatorBitmap,
    desk: EmulatorBitmap,
    supplies: EmulatorBitmap,
}

export class RoomWindow extends EmulatorWindow {

    private _searchables: EmulatorButton[];
    private _selected: EmulatorButton;
    private _topImages: EmulatorBitmap[];
    private _totalButtons: number;
    private _firstCrosswordView: boolean = false;
    private _i = 0;
    private _topImage: EmulatorElement;

    private _hintElements: EmulatorElement[] = [];

    private _addedCrossword: boolean = false;

    private getNextButtonId() {
        return this._i++;
    }

    addButton(button: EmulatorButton, topImage: EmulatorBitmap = undefined, onclick: () => void = undefined) {
        this._searchables.push(button);
        button.id = this.getNextButtonId();
        button.onclick = () => {
            if (topImage) {
                this._topImage._bitmap = topImage;
                this._topImage.show();
            }
            if (onclick) {
                onclick();
            }
        }
    }

    constructor(transform: IElementTransform, images: IRoomImages, topImages: ITopImages, crosswordWindow: CrosswordWindow, emulator: Emulator = globalThis.emulator) {
        super(transform, images.background.width, images.background.height, 'Pacman - mWAHAHAHHAHAHHA', true);
        
        this._totalButtons = Object.keys(images).length;
        
        this._topImage = new EmulatorElement({
            offsetX: 0, offsetY: 20, zIndex: 100
        }, topImages.desk);
        this._topImage.hide();

        
        this.setBackground(images.background);
        
        this._searchables = [];
        
        this.addButton(new EmulatorButton({
            offsetX: 60, offsetY: this.bitmap.height-images.desk.height-50, zIndex: -1
        }, images.supplies), topImages.supplies);
        
        this.addButton(new EmulatorButton({
            offsetX: 10, offsetY: this._bitmap.height-images.umbrella.height-10, zIndex: 1
        }, images.umbrella), topImages.umbrella);
        
        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width/2-images.carpet.width/2-10, offsetY: this.bitmap.height-images.carpet.height-2, zIndex: 0
        }, images.carpet), topImages.carpet);
        
        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width/2-images.painting.width/2+20, offsetY: this.bitmap.height/2-images.painting.height/2, zIndex: 0
        }, images.painting), topImages.painting);
        
        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width-images.desk.width-65, offsetY: this.bitmap.height-images.desk.height-50, zIndex: 0
        }, images.desk), topImages.desk, () => {
            if (!this._addedCrossword)
                emulator.addElement(crosswordWindow);
            crosswordWindow.afterclose = () => {
                this._addedCrossword = false; 
                this._closeElement.onclick();
            }
            this._addedCrossword = true;
        });
        
        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width-images.plant.width-5, offsetY: this.bitmap.height-images.plant.height-5, zIndex: 1
        }, images.plant), topImages.plant);
        
        for (let button of this._searchables) {
            this.addChild(button);
        }

        this._closeElement.onclick = () => {
            this._topImage.hide();
            if (this._addedCrossword) {
                emulator.removeElement(crosswordWindow);
                this._addedCrossword = false; 
            }
        }
        
        for (let button of this._hintElements) {
            this.addChild(button);
        }
        
        this.addChild(this._topImage);
    }
    
}
