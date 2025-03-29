import { IProductFull, IProductGalery } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, events } from "../base/events";
import { categorySetting } from "../../utils/constants";


export class GalleryCardView extends Component<IProductGalery> implements IProductGalery{
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;
    protected _id: string;
    protected _title: HTMLTitleElement;
    protected _price: HTMLSpanElement;
    protected _onClicked : (e : MouseEvent) => void;
    constructor(container: HTMLElement, protected events: IEvents,  onClicked : () => void){
        super(container);
        this._price = ensureElement('.card__price', this.container);
        this._title = ensureElement('.card__title', this.container) as HTMLTitleElement;
        this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._category = ensureElement('.card__category', this.container);
        this._onClicked = onClicked;

        this.container.addEventListener('click', (e)=> this._onClicked(e));
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
        }
        
    }
    set title(title: string){
        this.setText(this._title, title);
    }

    set id(id: string){
        this._id = id;
    }
    
}