import { IProduct } from "../../types";
import { Component } from "../base/Component";
import { CDN_URL, ColorCategory } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

// Класс отображения карточки как объект - родитель карточек с главными значениями - цена и название, сетеры
export class CardView extends Component<IProduct>{

    id : string;
    description: HTMLParagraphElement;
    image: HTMLImageElement;
    title: HTMLTitleElement;          
    category: HTMLSpanElement; 
    price: HTMLSpanElement;

    constructor( container: HTMLElement){
        super(container);
        this.price = ensureElement<HTMLSpanElement>('.card__price', this.container);
        this.title = ensureElement<HTMLTitleElement>('.card__title', this.container) as HTMLTitleElement;
    }

    set idCard(idValue: string){
        this.id = idValue;
    }

    set priceCard(priceValue: number){
        this.setText(this.price, priceValue)
    }

    set titleCard(titleValue: string){
        this.setText(this.title, titleValue);
    }

    set descrCard(descrValue : string){
        this.setText(this.description, descrValue);
    }
    set imgCard(imgValue : string){
        this.setImage(this.image, imgValue);
    }

    set catergoryCard(categoryValue : string){
        this.setText(this.category, categoryValue);
        if(categoryValue !== undefined){
            const categoryArr = Object.entries(ColorCategory);
            categoryArr.forEach((categoryItem) => {
                if(categoryItem[0] === categoryValue){
                    this.toggleClass(this.category, categoryItem[1]);
                }
            })
        }
        
    }

 
}