import { IProductFull } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { categorySetting } from "../../utils/constants";

export class PrevCardView extends Component<IProductFull> implements IProductFull{
    protected _description: HTMLParagraphElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;
    protected _id:string;
    protected _title: HTMLTitleElement;
    protected _price: HTMLSpanElement;
    protected _buttonToBasket : HTMLButtonElement;
    protected clickHandler : () => void
    constructor(container: HTMLElement, protected events: IEvents, onClicked : () => void){
        super(container);
        this._price = ensureElement('.card__price', this.container);
        this._title = ensureElement('.card__title', this.container) as HTMLTitleElement;
        this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._category = ensureElement('.card__category', this.container);
        this._description = ensureElement('.card__text', this.container) as HTMLParagraphElement;
        this._buttonToBasket = ensureElement('.button', this.container) as HTMLButtonElement;

        this.clickHandler = () => {
            onClicked();
            this.setDisabled(this._buttonToBasket, true);
        };

        this._buttonToBasket.addEventListener('click', this.clickHandler)  
    }

    destroy() {
        this._buttonToBasket.removeEventListener('click', this.clickHandler);
    }

    set buttonToBasket(status : boolean){
        if(status){
            this.setDisabled(this._buttonToBasket, false);
        } else {
            this.setDisabled(this._buttonToBasket, true);
        }
    }

    set image(image: string){
        this.setImage(this._image, image);
    }
 
    set category(category: string){
        this.setText(this._category, category);
        if(category in categorySetting){
            // this.toggleClass(this._category, categorySetting[category as keyof typeof categorySetting]);
            Object.values(categorySetting).forEach(className => {
        this._category.classList.remove(className);
    });
            this._category.classList.add(categorySetting[category as keyof typeof categorySetting]);
        }
    }

    set price(price: number | null){
        if(price !== null){
            this.setText(this._price, `${price} синапсов`);
        }else{
            this.setText(this._price, `Бесценно`);
            // this.setDisabled(this._buttonToBasket, true);
        }
         
    }

    set title(title: string){
        this.setText(this._title, title);
    }
 
    set id(id: string){
        this._id = id;
    }

    set description(description: string){
        this.setText(this._description, description);
    }

}