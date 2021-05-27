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

import background from '../assets/background1024.jpg';

import { EmulatorWindow } from './emulator/elements/window';
import { EmulatorTaskBar } from './emulator/elements/taskbar';

import { getImage, makeRequest } from './utils/requests';
import { EmulatorFont, IFont } from './emulator/text/font';
import { EmulatorFontManager, FontType } from './emulator/text/manager';
import { MailWindow } from './game/windows/mail';
import { CrosswordWindow } from './game/windows/crossword';
import { RoomWindow } from './game/windows/room';

document.body.onload = () => {
    var palette = BitmapRenderer.loadPalette();
    var emulator = new Emulator(palette);

    globalThis.emulator = emulator;

    emulator.addElement(new EmulatorTaskBar());

    (async function() {
        // var backgroundImage = await getImage(background);
        // var backgroundBitmap = EmulatorBitmap.loadImageFromHTML(backgroundImage, palette);
        // emulator.setBackgroundImage(backgroundBitmap);

        EmulatorFontManager.addFont(FontType.Normal, await EmulatorFont.loadFont(<IFont>segoeUI16Data, palette));
        EmulatorFontManager.addFont(FontType.NormalBold, await EmulatorFont.loadFont(<IFont>arial16boldData, palette));
        
        var crosswordWindow = await CrosswordWindow.create({
            offsetX: 10, offsetY: 20, zIndex: 40
        });
        emulator.addElement(crosswordWindow);

        let mailWindow = new MailWindow({
            offsetX: 20, offsetY: 50, zIndex: 5
        });
        emulator.addElement(mailWindow);

        // var roomWindow = new RoomWindow({
        //     offsetX: 50, offsetY: 50, zIndex: 50
        // }, await getImage(room), palette);
        // emulator.addElement(roomWindow);

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
