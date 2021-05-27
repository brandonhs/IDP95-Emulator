import { EmulatorBitmap, IBitmapData } from './emulator/bitmap/bitmap';
import { BitmapRenderer, EmulatorPaletteView } from './emulator/renderer';
import { EmulatorElement } from './emulator/element';
import { Emulator } from './emulator/emulator';

var saveByteArray = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = 'none';
    return function (data: ArrayBuffer[], name: string) {
        var blob = new Blob(data, {type: 'octet/stream'}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

document.body.onload = () => {
    var renderer = new BitmapRenderer(BitmapRenderer.loadPalette(), {
        width: 300, height: 200
    });
    var bitmap = EmulatorBitmap.createEmpty(300, 200).fill(7);

    let scale = 1;

    renderer.canvas.style.width = renderer.canvas.width * scale + 'px';
    renderer.canvas.style.height = renderer.canvas.height * scale + 'px';


    renderer.render(bitmap);

    globalThis.brushSize = 6;

    var color = 9;
    var drawing = false;

    var mx = 0, my = 0;

    renderer.canvas.onclick = function(e) {
        
        var rect = renderer.canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / scale;
        let y = (e.clientY - rect.top) / scale;

        bitmap.setPixel(x, y, color);
        renderer.render(bitmap);
    }

    renderer.canvas.onmousedown = function(e) {
        drawing = true;
        let x = e.offsetX / scale;
        let y = e.offsetY / scale;

        mx = x;
        my = y;
    }

    renderer.canvas.onmouseup = function(e) {
        drawing = false;
    }

    renderer.canvas.onmousemove = function(e) {
        if (drawing) {
            let x = e.offsetX / scale;
            let y = e.offsetY / scale;
 
            bitmap.line(mx, my, x, y, color, globalThis.brushSize, renderer);
            mx = x;
            my = y;
        }
    }

    let palette_view_root = document.createElement('div');
    document.body.appendChild(palette_view_root);

    let saveButton = document.createElement('button');
    saveButton.onclick = function() {
        var data = bitmap.exportBitmap();
        bitmap = EmulatorBitmap.loadImage(data);
        saveByteArray([data], 'image.idpimg');
        renderer.render(bitmap);
    }
    saveButton.innerText = 'SAVE';
    document.body.appendChild(saveButton);

    new EmulatorPaletteView(palette_view_root, renderer.palette, (id) => {
        color = id;
    });
}
