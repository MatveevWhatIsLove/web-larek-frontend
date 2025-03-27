import './scss/styles.scss';

import {ensureElement,
        cloneTemplate} from './utils/utils'

import {API_URL, CDN_URL, settings} from './utils/constants';

import {events} from './components/base/events';

import { ProductApi } from './components/modal/ProductApi';

import { orderList, IOrderResult, IProductFull, IProductBasket, IProductsFromApi, IProductGalery, IOrder } from './types/types';

import { ModalBasket } from './components/modal/ModalBasket';

import { CardBasket } from './components/View/CardBasket';

import { GalleryCardView } from './components/View/GalleryCardView';

import { PrevCardView } from './components/View/PrevCardView';

import { orderModal } from './components/modal/orderModal';

import { Success } from './components/View/Success';

import { FormForContacts } from './components/View/FormForContacts';

import { FormAdressPay } from './components/View/FormAdressPay';

import { BasketView } from './components/View/BasketView';

import { Modal } from './components/View/Modal';

import { CardsModal } from './components/modal/CardsModal';

import { Page } from './components/View/PageView';


const prevCard = cloneTemplate('#card-preview');

const modalCards = new CardsModal;
const basketModal = new ModalBasket;
const modalOrder = new orderModal;
const productsListApi = new ProductApi(API_URL, settings, CDN_URL);
const newBasket = new BasketView(cloneTemplate('#basket'), ()=>{events.emit('createOrder')});
const newModal = new Modal(ensureElement('#modal-container'), events);

const formAdressPay = new FormAdressPay(cloneTemplate('#order'));

const formEmailPhone = new FormForContacts(cloneTemplate('#contacts'));

const newPage = new Page(document.body, events);

const newSuc = new Success(cloneTemplate('#success'));

let newCard : GalleryCardView | null = null;

let newCardPrev : PrevCardView | null = null;



//Получение карточек 
productsListApi.getProdutList()
    .then(data => {
        modalCards.cardsItem = data.items;
    })
    .catch(res =>{
        console.log(res);
    })

// отображение страницы с карточками и корзиной
events.on('dataLoaded', ()=>{
    if(newCard){
        newCard.destroy();
    }
    modalCards.cardsItem.forEach((item : IProductFull)=>{
        newCard = new GalleryCardView(cloneTemplate('#card-catalog'), events, () =>{events.emit('cardGalaryClicked', item)});
        newPage.galary = newCard.render(item as IProductGalery) as HTMLButtonElement;
    });
    newPage.basketCount = basketModal.getCountBasket().toString();
    newPage.render();
})

// клик по карточек с удалением слушателя
events.on('cardGalaryClicked', (item: IProductFull)=>{

    if(newCardPrev){
        newCardPrev.destroy();
    }

    newCardPrev = new PrevCardView(prevCard, events, ()=> {events.emit('sendToBasket', item)});
    const isCardInBasket =  basketModal.getBasketItems().some(prod => prod.id === item.id)
    newCardPrev.buttonToBasket = !isCardInBasket
    
    newModal.content = newCardPrev.render(item); 
    newModal.render();
    newModal.open();
})

// добавление товара в корзину
events.on('sendToBasket', (item: IProductFull) => {
    if(!basketModal.getBasketItems().some(prod => prod.id === item.id)){
        const ItemToBasket : IProductBasket = {
            'id' : item.id,
            'price' : item.price,
            'title' : item.title
        }
        basketModal.addProductToBasket(ItemToBasket);
        newPage.basketCount = basketModal.getCountBasket().toString();
    }
})

// клик по корзине
events.on('basketClicked', ()=>{
    const basketItems = basketModal.getBasketItems();

    // Отображение товаров в корзине и событие их удаления
    newBasket.items  = basketItems.map((item)=>{
        const newCardBasket = new CardBasket(cloneTemplate('#card-basket'), events, (id: string) => {
            events.emit('basketDeleteItem', { id: id });
        });
        newCardBasket.index = basketItems.indexOf(item) + 1;
        return newCardBasket.render(item);
    })

    const isBasketClear = basketItems.length === 0 || basketModal.getSumOfProducts() === 0;
    newBasket.basketBtn = isBasketClear;
    
    newBasket.title = isBasketClear ? 'Корзина пуста' : 'Корзина';
    newBasket.price = basketModal.getSumOfProducts();

    newModal.content = newBasket.render();
    newModal.render();
    newModal.open();
})

// удаление карточки из корзины
events.on('basketDeleteItem', ({id} : {'id': string})=>{
    basketModal.removeProductFromBusket(id);
    newPage.basketCount = basketModal.getCountBasket().toString();
    events.emit('basketClicked');
})

// сохрарнеие товара и суммы для оформления + событие откртия формы адреса и способа оплаты
events.on('createOrder',()=>{
    const orderItems : orderList = {
        total : basketModal.getSumOfProducts(),
        items : basketModal.getBasketItems().filter(item => item.price !== null).map(item => item.id)
    }
    modalOrder.total= orderItems.total;
    modalOrder.items= orderItems.items;
    events.emit('openFormFirst'); 
})


events.on('openFormFirst',() => {
    modalOrder.clearAdressPay();
    formAdressPay.clearForm();
    newModal.content = formAdressPay.render();
    newModal.render();
    newModal.open();
})

// ФОРМА АДРЕСА И СПОСОБА ОПЛАТЫ
    // НАЧАЛО
// способ оплаты в модель
events.on('sendPay', (btn : HTMLButtonElement)=>{ 
    modalOrder.payment = btn.name;
    modalOrder.validateFormAdressPay();
});
// адрес в модель

events.on('sendAddress', (addressInput : HTMLInputElement) => {
    modalOrder.setInputAddress(addressInput.value);
    modalOrder.validateFormAdressPay();
});

events.on('showErrorsArdess', (errors : {address : string}) =>{
    formAdressPay.showErrors(errors);
    formAdressPay.switchBtn(true);
})

events.on('formArdessTrue', (errors : {address : string})=>{
    formAdressPay.showErrors(errors);
    formAdressPay.switchBtn(false);
})

    // КОНЕЦ

// ФОРМА ПОЧТЫ И ТЕЛЕФОНА
    // НАЧАЛО
events.on('openSecondForm', ()=>{
    modalOrder.clearEmailPhone();
    formEmailPhone.clear();
    newModal.content = formEmailPhone.render();
    newModal.render();
    newModal.open();
})

events.on('sendEmail', (formEmailInput : HTMLInputElement) =>{
    modalOrder.setInputEmail(formEmailInput.value);
    modalOrder.validateFormEmailPhone();
})

events.on('sendPhone', (phone :{num : string})=>{
    modalOrder.setInputNumb(phone.num);
    modalOrder.validateFormEmailPhone();
})

events.on('showErrorsFormEmailPhone', (errors : {number : string, email : string}) =>{
    formEmailPhone.showErrors(errors);
    formEmailPhone.switchBtn(true);
})

events.on('formArdessTrueFormEmailPhone', (errors : {number : string, email : string
})=>{
    formEmailPhone.showErrors(errors);
    formEmailPhone.switchBtn(false);
})

    // КОНЕЦ


// Отпарвка заказа и отображения успеха
events.on('sendOrder', ()=>{
    productsListApi.postOrder(modalOrder.getOrderFull())
        .then((res)=>{
            newSuc.orderSuccessDescription = res.total;
            newModal.content = newSuc.render();
            const originalClose = newModal.close.bind(newModal); // Сохраняем оригинальный метод
            newModal.close = function() {
                basketModal.clear(); // Вызываем clear()
                newPage.basketCount = basketModal.getCountBasket().toString();
                originalClose(); // Вызываем оригинальный метод close
                newModal.close = originalClose;
            };
            newModal.render();
            newModal.open();
        })
        .catch((res)=>{
            console.log(res);
        })
})

// закрытие успеха
events.on('closeSucBtn', ()=>{
    basketModal.clear();
    newPage.basketCount = basketModal.getCountBasket().toString();
    newModal.close();
})


// Блокировка скролла страницы
events.on('modalOpen', ()=>{
    newPage.locked = true;
})
// Разблокировка скролла страницы
events.on('modalClose', ()=>{
    newPage.locked = false;
})

