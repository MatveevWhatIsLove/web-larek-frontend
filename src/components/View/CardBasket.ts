import { IProductBasket } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
// import { ModalBasket } from "../modal/ModalMasket";
export class CardBasket extends Component<IProductBasket> implements IProductBasket{
    protected _id:string;
    protected _title: HTMLTitleElement;
    protected _price: HTMLSpanElement;
    protected _indexItem : HTMLSpanElement;
    protected _cardBtn : HTMLButtonElement;
    constructor(container: HTMLElement, protected events: IEvents, private onDeleteItem: (id: string) => void){
        super(container);
        this._cardBtn = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
        this._price = ensureElement('.card__price', this.container);
        this._title = ensureElement('.card__title', this.container) as HTMLTitleElement;
        this._indexItem = ensureElement('.basket__item-index', this.container);
        this._cardBtn.addEventListener('click', ()=>{
            this.onDeleteItem(this._id);
        })
    }

    set index(index : number){
        this.setText(this._indexItem, index);
    }

    set price(price: number | null){
        if(price !== null){
            this.setText(this._price, `${price} синапсов`);
        }else{
            this.setText(this._price, `Бесценно`);
        }
        
    }
    set title(title: string){
        this.setText(this._title, title);
    }

    set id(id: string){
        this._id = id;
        this.container.setAttribute('data-id', id);
    }

}