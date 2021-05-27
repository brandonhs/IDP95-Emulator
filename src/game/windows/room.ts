import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { IElementTransform } from "../../emulator/element";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";
import { IBitmapPalette } from "../../emulator/renderer";

export class RoomWindow extends EmulatorWindow {

    private _background: EmulatorBitmap;

    constructor(transform: IElementTransform, backgroundImage: HTMLImageElement, palette: IBitmapPalette) {
        super(transform, backgroundImage.width, backgroundImage.height, 'Pacman - mWAHAHAHHAHAHHA');

        this._background = EmulatorBitmap.loadImageFromHTML(backgroundImage, palette);
        this.setBackground(this._background);
    }

}
