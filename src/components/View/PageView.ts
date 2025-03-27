import { IEvents, events } from "../base/events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IPage } from "../../types/types";


export class Page extends Component<IPage> implements IPage{
    protected _galary : HTMLElement;
    protected _basket : HTMLButtonElement;
    protected _basketCount : HTMLSpanElement;
    protected _pageWrap : HTMLDivElement;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        this._galary = ensureElement('.gallery', this.container) as HTMLElement;
        this._basket = ensureElement('.header__basket', this.container) as HTMLButtonElement;
        this._basketCount = ensureElement('.header__basket-counter', this.container);
        this._pageWrap = ensureElement('.page__wrapper', this.container) as HTMLDivElement;

        this._basket.addEventListener('click', ()=>{
            events.emit('basketClicked');
        })
    }

    set galary(card: HTMLButtonElement){
        this._galary.appendChild(card);
    }

    set basketCount(num : string){
        this.setText(this._basketCount, num)
    }

    set locked(value : boolean){
        this.toggleClass(this._pageWrap, 'page__wrapper_locked', value);
    }
}