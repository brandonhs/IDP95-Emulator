import { EmulatorBitmap } from "../../emulator/bitmap/bitmap";
import { EmulatorElement } from "../../emulator/element";
import { Emulator } from "../../emulator/emulator";
import { getImage } from "../../utils/requests";
import { IPuzzle } from "../puzzle";
import { RoomWindow } from "../windows/room";

import room from '../../../assets/room.png';
import umbrella from '../../../assets/umbrella.png';
import carpet from '../../../assets/carpet.png';
import plant from '../../../assets/plant.png';
import painting from '../../../assets/painting.png';
import desk from '../../../assets/desk.png';
import deskTop from '../../../assets/desk_top3.png';
import supplies from '../../../assets/supplies.png';
import startButton from '../../../assets/start_button.png';
import { CrosswordWindow } from "../windows/crossword";
import { EmulatorTaskBar } from "../../emulator/elements/taskbar";

export class Puzzle1 implements IPuzzle {

    private _elements: EmulatorElement[];

    get elements() {
        return this._elements;
    }

    set elements(elements) {
        this._elements = elements;
    }

    static async instance(emulator: Emulator = globalThis.emulator) {
        var elements = [];

        var crosswordWindow = await CrosswordWindow.create({
            offsetX: 10, offsetY: 25, zIndex: 40
        });

        elements.push(new RoomWindow({
            offsetX: Math.floor(emulator.bitmap.width / 2 - 150), offsetY: Math.floor(emulator.bitmap.height / 2 - 150), zIndex: 50
        }, {
            background: EmulatorBitmap.loadImageFromHTML(await getImage(room), emulator.renderer.palette),
            umbrella:   EmulatorBitmap.loadImageFromHTML(await getImage(umbrella), emulator.renderer.palette),
            carpet:     EmulatorBitmap.loadImageFromHTML(await getImage(carpet), emulator.renderer.palette),
            painting:   EmulatorBitmap.loadImageFromHTML(await getImage(painting), emulator.renderer.palette),
            plant:      EmulatorBitmap.loadImageFromHTML(await getImage(plant), emulator.renderer.palette),
            desk:       EmulatorBitmap.loadImageFromHTML(await getImage(desk), emulator.renderer.palette),
            supplies:   EmulatorBitmap.loadImageFromHTML(await getImage(supplies), emulator.renderer.palette),
        }, {
            umbrella:   EmulatorBitmap.loadImageFromHTML(await getImage(umbrella), emulator.renderer.palette),
            carpet:     EmulatorBitmap.loadImageFromHTML(await getImage(carpet), emulator.renderer.palette),
            painting:   EmulatorBitmap.loadImageFromHTML(await getImage(painting), emulator.renderer.palette),
            plant:      EmulatorBitmap.loadImageFromHTML(await getImage(plant), emulator.renderer.palette),
            desk:       EmulatorBitmap.loadImageFromHTML(await getImage(deskTop), emulator.renderer.palette),
            supplies:   EmulatorBitmap.loadImageFromHTML(await getImage(supplies), emulator.renderer.palette),
        }, crosswordWindow));

        elements.push(new EmulatorTaskBar());

        return new this(elements);
    }

    constructor(elements: EmulatorElement[]) {
        this.elements = elements;
    }

}
