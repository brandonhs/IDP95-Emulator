import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement, IElementTransform } from "../../emulator/element";
import { EmulatorButton } from "../../emulator/elements/button";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";
import { IBitmapPalette } from "../../emulator/renderer";
import { EmulatorFontManager, FontType } from "../../emulator/text/manager";
import { getImage } from "../../utils/requests";

export interface IRoomImages {
    background: EmulatorBitmap,
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
    private _totalButtons: number;
    private _i = 0;
    private _hints: string[];

    private _hintElements: EmulatorElement[] = [];

    private getNextButtonId() {
        return this._i++;
    }

    addButton(button: EmulatorButton) {
        this._searchables.push(button);
        let hint = new EmulatorElement({
            offsetX: button.position.x, offsetY: button.position.y, zIndex: 10
        }, EmulatorFontManager.getFont(FontType.Normal).layout(this._hints[this._i]));
        hint.hide();
        this._hintElements.push(hint);
        button.id = this.getNextButtonId();
    }

    constructor(transform: IElementTransform, images: IRoomImages, hints: string[] = []) {
        super(transform, images.background.width, images.background.height, 'Pacman - mWAHAHAHHAHAHHA');

        this._hints = hints;

        this._totalButtons = Object.keys(images).length;

        this.setBackground(images.background);

        this._searchables = [];

        this.addButton(new EmulatorButton({
            offsetX: 60, offsetY: this.bitmap.height-images.desk.height-50, zIndex: -1
        }, images.supplies));
        
        this.addButton(new EmulatorButton({
            offsetX: 10, offsetY: this._bitmap.height-images.umbrella.height-10, zIndex: 1
        }, images.umbrella));

        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width/2-images.carpet.width/2-10, offsetY: this.bitmap.height-images.carpet.height-2, zIndex: 0
        }, images.carpet));

        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width/2-images.painting.width/2+20, offsetY: this.bitmap.height/2-images.painting.height/2, zIndex: 0
        }, images.painting));

        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width-images.desk.width-65, offsetY: this.bitmap.height-images.desk.height-50, zIndex: 0
        }, images.desk));
        
        this.addButton(new EmulatorButton({
            offsetX: this.bitmap.width-images.plant.width-5, offsetY: this.bitmap.height-images.plant.height-5, zIndex: 1
        }, images.plant));

        for (let button of this._searchables) {
            this.addChild(button);
            button.onclick = () => {
                if (this._selected) {
                    this._hintElements[this._selected.id].hide();
                }
                this._selected = button;
                this._hintElements[button.id].show();
            }
        }

        for (let button of this._hintElements) {
            this.addChild(button);
        }
    }

}
