import { IProductGalery } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { categorySetting } from "../../utils/constants";


export class GalleryCardView extends Component<IProductGalery> implements IProductGalery{
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;
    protected _id: string;
    protected _title: HTMLTitleElement;
    protected _price: HTMLSpanElement;
    
    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        this._price = ensureElement('.card__price', this.container);
        this._title = ensureElement('.card__title', this.container) as HTMLTitleElement;
        this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._category = ensureElement('.card__category', this.container);
    }

    set image(image: string){
       this.setImage(this._image, image);
    }

    set category(category: string){
        this.setText(this._category, category);
        if(category in categorySetting){
            this.toggleClass(this._category, categorySetting[category as keyof typeof categorySetting]);
        }
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
    }
    
}