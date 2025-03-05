import './scss/styles.scss';

import {pascalToKebab, 
        isSelector,
        isEmpty,
        ensureAllElements,
        ensureElement,
        cloneTemplate,
        bem,
        getObjectProperties,
        setElementData,
        getElementData,
        isPlainObject,
        isBoolean,
        createElement} from './utils/utils'

import {API_URL, CDN_URL, settings} from './utils/constants';

import { Component} from './components/base/Component';

import {ApiListResponse , ApiPostMethods, Api } from './components/base/api'

import { EventEmitter, events } from './components/base/events';

import { getProductApi } from './components/modal/getProductApi';

// export interface IProduct{
//     id:string,
//     description: string,
//     image: string,
//     title: string;
//     category: string,
//     price: number | null;     
// }

// export type IProductBasket = Pick<IProduct, 'id'| 'price'| 'title'>;
// export type IProductPrev = Pick<IProduct, 'id' |'description' |  'image' | 'title' | 'category' | 'price'>;
// export type IProductGalery = Pick<IProduct, 'id' |  'image' | 'title' | 'category' | 'price'>;

export interface IProductBasket 
{ 
    id: string, 
    price:number|null, 
    title: string
};

export interface IProductGalery extends IProductBasket
{
    image: string,
    category: string
}
export interface IProductFull extends IProductGalery
{
    description: string
}

export type IProductsFromApi = {
    total: number,
    items: IProductFull[];
}

const categorySetting  = {
    'софт-скил': 'card__category_soft', 
    'другое' : 'card__category_other',
    'дополнительное' : 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard'
}

events.on('cardGalaryClicked', (item: IProductFull)=>{
    console.log('клик по карточке с id: ',  item.id);

    
})

events.on('dataLoaded', (data:IProductsFromApi)=>{
    data.items.forEach((item)=>{
        const cardTemplate = cloneTemplate('#card-catalog');
        const newCard = new GalleryCardView(cardTemplate).render(item);
        newCard.addEventListener('click', e=>{
            events.emit('cardGalaryClicked', item);
        })
        document.querySelector('.gallery').appendChild(newCard);
    })
})

// Отображение карточек

class CardBasket extends Component<IProductBasket>{
    private _id:string;
    // private _description: HTMLParagraphElement;
    // private _image: HTMLImageElement;
    private _title: HTMLTitleElement;
    // private _category: HTMLSpanElement;
    private _price: HTMLSpanElement;

    constructor(container: HTMLElement){
        super(container);
        this._price = ensureElement('.card__price', this.container);
        // this._id = setElementData(this.container, id) 
        // this._description = ensureElement('.card__text', this.container) as HTMLParagraphElement;
        // this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._title = ensureElement('.card__title', this.container) as HTMLTitleElement;
        // this._category = ensureElement('.card__category', this.container);
    }

    set price(price: number | null){
        if(price !== null){
            this.setText(this._price, `${price} синапсов`);
        }else{
            this.setText(this._price, `Бесценно`);
        }
        
    }

    // set description(description: string){
    //     this.setText(this._description, description);
    // }

    // set image(image: string){
    //    this.setImage(this._image, image);
    // }

    set title(title: string){
        this.setText(this._title, title);
    }

    // set category(category: string){
    //     this.setText(this._category, category);
    //     if(category in categorySetting){
    //         this.toggleClass(this._category, categorySetting[category as keyof typeof categorySetting]);
    //     }
    // }

    set id(id: string){
        this._id = id;
    }
}

class GalleryCardView extends CardBasket{
    private _image: HTMLImageElement;
    private _category: HTMLSpanElement;
    
    constructor(container: HTMLElement){
        super(container);
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

}

class PrevCardView extends GalleryCardView{
    private _description: HTMLParagraphElement;
    constructor(container: HTMLElement){
        super(container);
        this._description = ensureElement('.card__text', this.container) as HTMLParagraphElement;
    }

    set description(description: string){
        this.setText(this._description, description);
    }

}


//Экземпляр класса поулчения карточек
const productsListApi = new getProductApi(API_URL, settings, CDN_URL);

//Получение карточек и сработка слушателя, что данные полученны
productsListApi.getProdutList()
    .then(data => {
        events.emit('dataLoaded', (data));
    })