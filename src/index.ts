import { EmulatorBitmap, IBitmapData } from './emulator/bitmap/bitmap';
import { BitmapRenderer, EmulatorPaletteView } from './emulator/renderer';
import { EmulatorElement } from './emulator/element';
import { Emulator } from './emulator/emulator';

import * as arial16Data from '../assets/arial16.json';
import * as arial16boldData from '../assets/arial16bold.json';
import * as segoeUI16BoldData from '../assets/segoe_ui_16_bold.json';
import * as segoeUI16Data from '../assets/segoe_ui_16.json';
import * as segoeUI16BlackData from '../assets/segoe_ui_black_16.json';
import * as segoeUI9Data from '../assets/segoe_ui_9.json';

import room from '../assets/room.png';
import umbrella from '../assets/umbrella.png';
import carpet from '../assets/carpet.png';
import plant from '../assets/plant.png';
import painting from '../assets/painting.png';
import desk from '../assets/desk.png';
import deskTop from '../assets/desk_top3.png';
import supplies from '../assets/supplies.png';
import startButton from '../assets/start_button.png';

import { EmulatorWindow } from './emulator/elements/window';
import { EmulatorTaskBar } from './emulator/elements/taskbar';

import { getImage, makeRequest } from './utils/requests';
import { EmulatorFont, IFont } from './emulator/text/font';
import { EmulatorFontManager, FontType } from './emulator/text/manager';
import { MailWindow } from './game/windows/mail';
import { CrosswordWindow } from './game/windows/crossword';
import { RoomWindow } from './game/windows/room';
import { EmulatorTerminal } from './game/windows/terminal';
import { GameTimer } from './emulator/elements/timer';
import { StartWindow } from './game/windows/start';

document.body.onload = () => {
    var palette = BitmapRenderer.loadPalette();
    var emulator = new Emulator(palette);

    globalThis.emulator = emulator;

    (async function() {
        EmulatorFontManager.addFont(FontType.Normal, await EmulatorFont.loadFont(<IFont>segoeUI16Data, palette));
        EmulatorFontManager.addFont(FontType.NormalBold, await EmulatorFont.loadFont(<IFont>arial16boldData, palette));

        // var crosswordWindow = await CrosswordWindow.create({
        //     offsetX: 10, offsetY: 225, zIndex: 40
        // });

        // var roomWindow = new RoomWindow({
        //     offsetX: 425, offsetY: 75, zIndex: 50
        // }, {
        //     background: EmulatorBitmap.loadImageFromHTML(await getImage(room), palette),
        //     umbrella:   EmulatorBitmap.loadImageFromHTML(await getImage(umbrella), palette),
        //     carpet:     EmulatorBitmap.loadImageFromHTML(await getImage(carpet), palette),
        //     painting:   EmulatorBitmap.loadImageFromHTML(await getImage(painting), palette),
        //     plant:      EmulatorBitmap.loadImageFromHTML(await getImage(plant), palette),
        //     desk:       EmulatorBitmap.loadImageFromHTML(await getImage(desk), palette),
        //     supplies:   EmulatorBitmap.loadImageFromHTML(await getImage(supplies), palette),
        // }, {
        //     umbrella:   EmulatorBitmap.loadImageFromHTML(await getImage(umbrella), palette),
        //     carpet:     EmulatorBitmap.loadImageFromHTML(await getImage(carpet), palette),
        //     painting:   EmulatorBitmap.loadImageFromHTML(await getImage(painting), palette),
        //     plant:      EmulatorBitmap.loadImageFromHTML(await getImage(plant), palette),
        //     desk:       EmulatorBitmap.loadImageFromHTML(await getImage(deskTop), palette),
        //     supplies:   EmulatorBitmap.loadImageFromHTML(await getImage(supplies), palette),
        // }, crosswordWindow);
        // emulator.addElement(roomWindow);

        var startWindow = new StartWindow(EmulatorBitmap.loadImageFromHTML(await getImage(startButton), palette));
        emulator.addElement(startWindow);
        startWindow.onclose = () => {
            emulator.openDialog('You must\nplay\nto earn your\nfreedom');
        }

        new EmulatorPaletteView((() => {
            var div = document.createElement('div');
            document.body.appendChild(div);
            return div;
        })(), emulator.renderer.palette, (id) => {
            console.log(id);
        });
        emulator.start();
    })();
}
