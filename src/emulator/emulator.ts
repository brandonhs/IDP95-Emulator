import { Demontavious } from '../game/characters/demontavious';
import { DialogWindow } from '../game/windows/dialog';
import { EmulatorTerminal } from '../game/windows/terminal';
import { EmulatorBitmap } from './bitmap/bitmap';
import { EmulatorElement } from './element';
import { EmulatorTaskBar } from './elements/taskbar';
import { EmulatorWindow } from './elements/window';
import { BitmapRenderer } from './renderer';

export class Emulator {
    
    private _screenBitmap: EmulatorBitmap;
    private _elements: EmulatorElement[];
    private _renderer: BitmapRenderer;
    private _mouseDown: boolean;
    private _cycleCount: number;
    private _demontavious: Demontavious;
    
    private _puzzleIndex: number = 0;

    public terminal: EmulatorTerminal;
    
    get cycles() {
        return this._cycleCount;
    }
    
    constructor(palette = BitmapRenderer.loadPalette()) {
        this._screenBitmap = EmulatorBitmap.createEmpty(800, 600);
        this._screenBitmap.fill(15);
        this._elements = [];
        this._renderer = new BitmapRenderer(palette, {
            width: 800, height: 600
        });
        
        this._demontavious = new Demontavious({
            offsetX: this._screenBitmap.width-40, offsetY: this._screenBitmap.height-40, zIndex: Infinity
        });
        
        this._mouseDown = false;
        
        var prevOffsetX = 0, prevOffsetY = 0;
        
        this.renderer.canvas.onmousedown = (e) => {
            var maxIndex = 0;
            this._elements.forEach((v) => { if (v.zIndex !== Infinity) maxIndex = Math.max(v.zIndex, maxIndex) });
            this._elements.sort((a, b) => b.sort(a));
            for (let element of this._elements) {
                if (element.containsMouse(e.offsetX, e.offsetY)) {
                    element.handleMouseDown(e.offsetX, e.offsetY);
                    if (element.zIndex !== Infinity) {
                        element.setIndex(maxIndex + 1);
                    }
                    break;
                }
            }
            this._mouseDown = true;
            prevOffsetX = e.offsetX;
            prevOffsetY = e.offsetY;
        }
        
        window.onkeydown = (e: KeyboardEvent) => {
            this._elements.sort((a, b) => b.sort(a));
            for (let element of this._elements) {
                if (element instanceof EmulatorWindow) {
                    element.sendKey(e.key);
                    break;
                }
            }
            e.preventDefault();
        };
        
        this.renderer.canvas.onmouseup = (e) => {
            this._elements.sort((a, b) => b.sort(a));
            for (let element of this._elements) {
                if (element.containsMouse(e.offsetX, e.offsetY)) {
                    element.handleMouseUp(e.offsetX, e.offsetY);
                    break;
                }
            }
            this._mouseDown = false;
            prevOffsetX = e.offsetX;
            prevOffsetY = e.offsetY;
        }
        
        this.renderer.canvas.onmousemove = (e) => {
            this._elements.sort((a, b) => b.sort(a));
            if (this._mouseDown) {
                for (let element of this._elements) {
                    element.handleMouseDrag(e.offsetX, e.offsetY, e.offsetX - prevOffsetX, e.offsetY - prevOffsetY);
                }
            }
            prevOffsetX = e.offsetX;
            prevOffsetY = e.offsetY;
        }
        
        this.addElement(new EmulatorTaskBar());
        //this.addElement(this._demontavious);
    }
    
    focus(window: EmulatorWindow) {
        let maxIndex = 0;
        this._elements.forEach((v) => { if (v.zIndex !== Infinity) maxIndex = Math.max(v.zIndex, maxIndex) });
        this._elements.sort((a, b) => b.sort(a));
        window.setIndex(maxIndex + 1);
    }

    next() {
        this._puzzleIndex++;
        console.log('nextttt');
    }

    openDialog(text: string) {
        var dialog = new DialogWindow(text);
        this.addElement(dialog);
    }
    
    speak(text: string) {
        this._demontavious.speak(text);
    }

    removeElement(element: EmulatorElement) {
        let index = this._elements.indexOf(element);
        if (index < 0) return;
        this._elements.splice(index, 1);
    }

    setBackgroundImage(image: EmulatorBitmap) {
        this._screenBitmap = this._screenBitmap.blit(image);
    }

    get bitmap() {
        return this._screenBitmap;
    }

    get renderer() {
        return this._renderer;
    }

    start() {
        this.update();
    }

    update() {
        requestAnimationFrame(() => {
            this.render();
            this.update();
        });
    }

    render() {
        var buffer = new EmulatorBitmap(this._screenBitmap);
        this._elements.sort((a, b) => a.sort(b));
        for (let element of this._elements) {
            buffer = buffer.blit(element.bitmap, element.position.x, element.position.y);
        }
        this._renderer.render(buffer);
        //this._screenBitmap = buffer;
    }

    write(text: string) {
        this.terminal.write(text);
    }

    addElement(element: EmulatorElement) {
        this._elements.push(element);
        if (element instanceof EmulatorWindow && !element.noClose) {
            element.onclose = () => {
                this._elements.splice(this._elements.indexOf(element), 1);
            }
        }
        if (element instanceof EmulatorTerminal) {
            this.terminal = element;
        }
    }

}
