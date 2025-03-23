import { IBasketView } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class BasketView extends Component<IBasketView>{
    protected _basketList : HTMLUListElement;
    protected _items : HTMLElement[];
    protected _basketPrice : HTMLSpanElement;
    protected _basketTitle : HTMLTitleElement;
    protected _basketBtn : HTMLButtonElement;
    constructor(container: HTMLElement, private onCreateOrder: () => void){
            super(container);
            this._basketTitle = ensureElement('.modal__title', this.container) as HTMLTitleElement;
            this._basketList = ensureElement('.basket__list', this.container) as HTMLUListElement;
            this._basketPrice = ensureElement('.basket__price', this.container) as HTMLSpanElement;
            this._basketBtn = ensureElement('.basket__button', this.container) as HTMLButtonElement;
            this._items = [];

            this._basketBtn.addEventListener('click', ()=>{
                // events.emit('createOrder');
                this.onCreateOrder();
            })
            
    }

    set title(title: string){
        this.setText(this._basketTitle, title);
    }

    set basketBrn(status : boolean){
        this.setDisabled(this._basketBtn, status);
    }

    set items(items: HTMLElement[]){
        this._items = items;
        this._basketList.replaceChildren(...items);
    }

    get items(){
        return this._items;
    }

    set price(price : number){
        this.setText(this._basketPrice, `${price} синапсов`);
    }
}