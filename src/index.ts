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

import { EventEmitter, events , IEvents} from './components/base/events';

import { getProductApi } from './components/modal/getProductApi';


const modal = document.querySelector('.modal') as HTMLDivElement;
const modalContent = modal.querySelector('.modal__content');

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
    const prevCard = cloneTemplate('#card-preview');
    const newModal = new Modal(ensureElement('#modal-container'), events);
    newModal.content = new PrevCardView(prevCard, events).render(item);
    newModal.render();
    newModal.open();
})

events.on('dataLoaded', (data:IProductsFromApi)=>{
    data.items.forEach((item : IProductGalery)=>{
        const cardTemplate = cloneTemplate('#card-catalog');
        const newCard = new GalleryCardView(cardTemplate, events).render(item as IProductGalery);
        // const galleryItem = item:
        console.log();
        newCard.addEventListener('click', ()=>{
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

    constructor(container: HTMLElement, protected events: IEvents){
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

class GalleryCardView extends CardBasket implements IProductGalery{
    private _image: HTMLImageElement;
    private _category: HTMLSpanElement;
    
    constructor(container: HTMLElement, protected events: IEvents){
        super(container, events);
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
    constructor(container: HTMLElement, protected events: IEvents){
        super(container, events);
        this._description = ensureElement('.card__text', this.container) as HTMLParagraphElement;
    }

    set description(description: string){
        this.setText(this._description, description);
    }

}

export interface IModal{
    open(): void;
    close(): void;
}

class Modal extends Component<IModal>{
    private _closeBtn : HTMLButtonElement;
    private _content : HTMLDivElement;
    private _pageWrap : HTMLDivElement;
    
    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        this._closeBtn = ensureElement('.modal__close', this.container) as HTMLButtonElement;
        this._content = ensureElement('.modal__content', this.container) as HTMLDivElement;
        this._pageWrap = document.querySelector('.page__wrapper') as HTMLDivElement;

        this._closeBtn.addEventListener('click', (e)=>{
            if((e.target instanceof HTMLButtonElement && e.target.classList.contains('modal__close'))){
                this.close();
            }
        })

        this.container.addEventListener('click', (e)=>{
            if(e.target instanceof HTMLDivElement && e.target.classList.contains('modal_active')){
                this.close();
            }
        })

        window.addEventListener('keydown', (e)=>{
            console.log(e.key);
            if(e.key === 'Escape'){
                this.close();
            }
        })
    }

    set content(elem: HTMLElement){
        this._content.replaceChildren(elem);
    }

    open(){
        this.container.classList.add('modal_active');
        this._pageWrap.classList.add('page__wrapper_locked');
    }

    close(){
        this.container.classList.remove('modal_active');
        this._pageWrap.classList.remove('page__wrapper_locked');
    }

    // render(): HTMLElement {
    //     this._content;
    //     return this.container;
    // }
}


const productsListApi = new getProductApi(API_URL, settings, CDN_URL);

//Получение карточек и сработка слушателя, что данные полученны
productsListApi.getProdutList()
    .then(data => {
        events.emit('dataLoaded', (data));
    })