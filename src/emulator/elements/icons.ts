import { EmulatorBitmap } from "../bitmap/bitmap";

export interface IEmulatorButton {
    bitmapNormal: EmulatorBitmap;
    bitmapDown: EmulatorBitmap;
}

export const Close: IEmulatorButton = {
    bitmapNormal: EmulatorBitmap.createEmpty(20, 20).fill(254).line(0, 0, 21, 21, 248, 1).line(21, 0, 0, 21, 248, 1),
    bitmapDown: EmulatorBitmap.createEmpty(20, 20).fill(9).line(0, 0, 21, 21, 248, 1).line(21, 0, 0, 21, 248, 1),
};
