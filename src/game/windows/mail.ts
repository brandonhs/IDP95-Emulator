import { IElementTransform } from "../../emulator/element";
import { EmulatorInbox } from "../../emulator/elements/inbox";
import { EmulatorWindow } from "../../emulator/elements/window";

export class MailWindow extends EmulatorWindow {

    private _inbox: EmulatorInbox;

    constructor(transform: IElementTransform) {
        super(transform, 500, 400, 'Inlook - You have new messages!');

        this._inbox = new EmulatorInbox({
            offsetX: 0, offsetY: this.titleBarHeight, zIndex: 0
        }, [
            {
                name: 'You',
                from: 'dailyprizes@remail.com',
                content: 'Click here to claim your $100 prize.',
                date: '5/24/2021'
            },
            {
                name: 'You',
                from: 'mark87@bemail.com',
                content: 'Hey, I think I found your car.',
                date: '5/23/2021'
            },
            {
                name: 'You',
                from: 'tractorinsurance@bemail.com',
                content: 'Sign up now and get life insurance for LIFE',
                date: '5/23/2021'
            },
            {
                name: 'You',
                from: 'hillberry@farmail.com',
                content: 'Come down to your local market and buy our berries!',
                date: '5/23/2021'
            },
        ], this.bitmap.width);

        this.addChild(this._inbox);
    }

}
