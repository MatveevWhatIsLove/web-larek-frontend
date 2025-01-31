import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ColorCategory } from "../../utils/constants";

// Установка всех значений для экземляра класса
export class productMainView extends Component<IProduct>{

    protected idProduct: string;  
    protected imageProduct: HTMLImageElement;
    protected titleProduct: HTMLTitleElement;          
    protected categoryProduct: HTMLSpanElement; 
    protected priceProduct: HTMLSpanElement

    constructor(container: HTMLElement){
        super(container);

        this.imageProduct = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.titleProduct = ensureElement<HTMLTitleElement>('.card__title', this.container);
        this.categoryProduct = ensureElement<HTMLSpanElement>('.card__category', this.container);
        this.priceProduct = ensureElement<HTMLSpanElement>('.card__price', this.container);

    }

    set image(imageProductValue : string){
        console.log('img')
        this.setImage(this.imageProduct, imageProductValue);
    }

    set title(titleValue : string){
        this.setText(this.titleProduct, titleValue);
    }

    set category(categoryValue : string){
        this.setText(this.categoryProduct, categoryValue);

        const colorCategoryArr = Object.entries(ColorCategory);

        colorCategoryArr.forEach(element => {
            if(element[0] === categoryValue){
                this.toggleClass(this.categoryProduct, element[1])
            }
        });
    }

    set price(priceValue : string){
        this.setText(this.priceProduct, priceValue);
    }
}