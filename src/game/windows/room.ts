import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { IElementTransform } from "../../emulator/element";
import { EmulatorButton } from "../../emulator/elements/button";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";
import { IBitmapPalette } from "../../emulator/renderer";
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

    private _umbrella: EmulatorButton;
    private _carpet: EmulatorButton;
    private _painting: EmulatorButton;
    private _plant: EmulatorButton;
    private _desk: EmulatorButton;
    private _supplies: EmulatorButton;

    constructor(transform: IElementTransform, images: IRoomImages) {
        super(transform, images.background.width, images.background.height, 'Pacman - mWAHAHAHHAHAHHA');

        this.setBackground(images.background);
        this._supplies = new EmulatorButton({
            offsetX: 60, offsetY: this.bitmap.height-images.desk.height-50, zIndex: -1
        }, images.supplies);
        this.addChild(this._supplies);
        
        this._umbrella = new EmulatorButton({
            offsetX: 10, offsetY: this._bitmap.height-images.umbrella.height-10, zIndex: 1
        }, images.umbrella);
        this.addChild(this._umbrella);

        this._carpet = new EmulatorButton({
            offsetX: this.bitmap.width/2-images.carpet.width/2-10, offsetY: this.bitmap.height-images.carpet.height-2, zIndex: 0
        }, images.carpet);
        this.addChild(this._carpet);

        this._painting = new EmulatorButton({
            offsetX: this.bitmap.width/2-images.painting.width/2+20, offsetY: this.bitmap.height/2-images.painting.height/2, zIndex: 0
        }, images.painting);
        this.addChild(this._painting);

        this._desk = new EmulatorButton({
            offsetX: this.bitmap.width-images.desk.width-65, offsetY: this.bitmap.height-images.desk.height-50, zIndex: 0
        }, images.desk);
        this.addChild(this._desk);
        
        this._plant = new EmulatorButton({
            offsetX: this.bitmap.width-images.plant.width-5, offsetY: this.bitmap.height-images.plant.height-5, zIndex: 1
        }, images.plant);
        this.addChild(this._plant);

        this._desk.onclick = () => {
            console.log('asd');
        }
    }

}
