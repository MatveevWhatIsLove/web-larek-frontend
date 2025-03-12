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

export interface IPage{
    'cards' : IProductFull[],
    'basketCount' : number
}

const categorySetting  = {
    'софт-скил': 'card__category_soft', 
    'другое' : 'card__category_other',
    'дополнительное' : 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard'
}


const modal = document.querySelector('.modal') as HTMLDivElement;
const modalContent = modal.querySelector('.modal__content');


// MODAL
class ModalBasket {
    private _productsInBasket : IProductBasket[];
    private _basketCount : HTMLSpanElement;
    constructor(){
        this._productsInBasket = [];
        this._basketCount = document.querySelector('.header__basket-counter') as HTMLSpanElement;
    }

    addProductToBasket(item: IProductBasket){
        this._productsInBasket.push(item);
        console.log(this._productsInBasket);
        this.setCountBasket();
        return this._productsInBasket;
    }

    removeProductFromBusket(item : IProductBasket){
        this._productsInBasket.forEach((product)=>{
            if(product.id = item.id){
                const productToDel = this._productsInBasket.indexOf(product);
                this._productsInBasket.slice(productToDel, 1);
            }
        });
        this.setCountBasket();
        return this._productsInBasket;
    }

    getSumOfProducts(){
        let sum = 0;
        this._productsInBasket.forEach((prodct) => {
            if(prodct.price !== null){
                sum += prodct.price;
            } else {
                sum += 0;
            }
        });

        return sum;
    }

    getCountBasket(){
        const basketCount = this._productsInBasket.length;
        return basketCount
    }

    setCountBasket(){
        this._basketCount.textContent = this.getCountBasket().toString();
    }

    getBasketItems(){
        return this._productsInBasket
    }
}

const BasketModal = new ModalBasket;

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







//VIEW Отображение карточек

class CardBasket extends Component<IProductBasket>{
    private _id:string;
    private _title: HTMLTitleElement;
    private _price: HTMLSpanElement;
    // private _indexItem : HTMLSpanElement;
    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        this._price = ensureElement('.card__price', this.container);
        this._title = ensureElement('.card__title', this.container) as HTMLTitleElement;
        // this._indexItem = ensureElement('.basket__item-index', this.container);
        
    }

    set index(index : number){
        // this._indexItem =;
        this.setText(ensureElement('.basket__item-index', this.container), index);
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
    // private _buttonToBasket : HTMLButtonElement;
    constructor(container: HTMLElement, protected events: IEvents){
        super(container, events);
        this._description = ensureElement('.card__text', this.container) as HTMLParagraphElement;
        // this._buttonToBasket = ensureElement('.button', this.container) as HTMLButtonElement;

        // this._buttonToBasket.addEventListener('click', ()=>{
        //     events.emit('sendToBasket');
        // })
        
    }

    set description(description: string){
        this.setText(this._description, description);
    }

}

export interface IBasketView {
    
}

class BasketView extends Component<IBasketView>{
    private _basketList : HTMLUListElement;
    private _items : HTMLElement[];
    private _basketPrice : HTMLSpanElement;
    constructor(container: HTMLElement){
            super(container);
            this._basketList = ensureElement('.basket__list', this.container) as HTMLUListElement;
            this._basketPrice = ensureElement('.basket__price', this.container) as HTMLSpanElement;
            this._items = [];
    }

    set items(items: HTMLElement[]){
        this._items = items;
        this._basketList.replaceChildren(...items);
    }

    set price(price : number){
        this.setText(this._basketPrice, `${price} синапсов`);
    }
}
const baskettempl = cloneTemplate('#basket');


export interface IModal{
    open(): void;
    close(): void;
}

export  interface cardCreated  {
    'cardFullInfo' : IProductFull[],
    'cardsGallaryHTML' : HTMLElement[]
};

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
}


interface IPostOrder {
    'payment' : 'online' | 'ofline',
    'email' : string,
    'phone' : string,
    'address' : string,
    'total' : number,
    'items' : string[];
}

// class productPostApiBasket extends Api{
//     itemId: IProductFull;

//     constructor(baseUrl: string, options: RequestInit = {}, itemId:IProductFull){
//         super(baseUrl, options);
//         this.itemId = itemId;
//     }
// // : Promise<IPostOrder>
//     postProductApi (){
//         return this.post('/order', this.itemId)
//         .then((data : IPostOrder)=>{
//             return data;
//         })
//     }
// }

const productsListApi = new getProductApi(API_URL, settings, CDN_URL);

//Получение карточек и сработка слушателя, что данные полученны
productsListApi.getProdutList()
    .then(data => {
        events.emit('dataLoaded', (data));
    })

events.on('sendToBasket', (item: IProductFull) => {
    const ItemToBasket : IProductBasket = {
        'id' : item.id,
        'price' : item.price,
        'title' : item.title
    }
    BasketModal.addProductToBasket(ItemToBasket);
})

events.on('cardGalaryClicked', (item: IProductFull)=>{
    const prevCard = cloneTemplate('#card-preview');
    const newModal = new Modal(ensureElement('#modal-container'), events);
    newModal.content = new PrevCardView(prevCard, events).render(item); 
    const modalCardBtnToBasket = ensureElement('.button', newModal.content);
    modalCardBtnToBasket.addEventListener('click', ()=>{
        events.emit('sendToBasket', item);
    })

    newModal.render();
    newModal.open();
})

events.on('basketClicked', (items: IProductBasket[])=>{
    const ItemsForBasket = BasketModal.getBasketItems().map((item)=>{
        const newCardBasketTempl = cloneTemplate('#card-basket');
        const newCardBasket = new CardBasket(newCardBasketTempl, events);
        newCardBasket.index = BasketModal.getBasketItems().indexOf(item) + 1;
        return newCardBasket.render(item);
    })

    const newBasketTempl = cloneTemplate('#basket');
    const newBasket = new BasketView(newBasketTempl);
    newBasket.items = ItemsForBasket;
    newBasket.price = BasketModal.getSumOfProducts();
    const newModal = new Modal(ensureElement('#modal-container'), events);
    newModal.content = newBasket.render();
    newModal.render();
    newModal.open();
})


events.on('dataLoaded', (data:IProductsFromApi)=>{
    data.items.forEach((item : IProductGalery)=>{
        const cardTemplate = cloneTemplate('#card-catalog');
        const newCard = new GalleryCardView(cardTemplate, events).render(item as IProductGalery);
        newCard.addEventListener('click', ()=>{
            events.emit('cardGalaryClicked', item);
        }) 
        document.querySelector('.gallery').appendChild(newCard);
    })
    document.querySelector('.header__basket-counter').textContent = BasketModal.getCountBasket().toString();
    document.querySelector('.header__basket').addEventListener('click', ()=>{
        events.emit('basketClicked', BasketModal.getBasketItems());
    })
})