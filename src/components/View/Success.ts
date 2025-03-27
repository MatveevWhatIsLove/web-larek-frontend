import { ISuccess } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { events } from "../base/events";

export class Success extends Component<ISuccess> implements ISuccess{
    protected _orderSuccessDescription : HTMLParagraphElement;
    protected _orderSuccessClose : HTMLButtonElement;
    constructor (container : HTMLElement){
        super(container);
        this._orderSuccessDescription = ensureElement('.order-success__description', this.container) as HTMLParagraphElement;
        this._orderSuccessClose = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        this._orderSuccessClose.addEventListener('click', (e)=>{
            e.preventDefault();
            events.emit('closeSucBtn');
        })
    }

    set orderSuccessDescription(orderSuccessDescription : number){
        this.setText(this._orderSuccessDescription, `Списано ${orderSuccessDescription} синапсов`);
    }
}