import './scss/styles.scss';

import {ensureElement,
        cloneTemplate} from './utils/utils'

import {API_URL, CDN_URL, settings} from './utils/constants';

import {events} from './components/base/events';

import { ProductApi } from './components/model/ProductApi';

import { IProductFull, IProductBasket, IProductGalery } from './types/types';

import { BasketModel } from './components/model/BasketModel';

import { CardBasket } from './components/View/CardBasket';

import { GalleryCardView } from './components/View/GalleryCardView';

import { PrevCardView } from './components/View/PrevCardView';

import { orderModel } from './components/model/OrderModel';

import { Success } from './components/View/Success';

import { FormForContacts } from './components/View/FormForContacts';

import { FormAdressPay } from './components/View/FormAdressPay';

import { BasketView } from './components/View/BasketView';

import { Modal } from './components/View/Modal';

import { CardsModel } from './components/model/CardsModel';

import { Page } from './components/View/PageView';

const modalCards = new CardsModel;
const basketModel = new BasketModel;
const modelOrder = new orderModel;
const productsListApi = new ProductApi(API_URL, settings, CDN_URL);
const newBasket = new BasketView(cloneTemplate('#basket'), ()=>{events.emit('openFormFirst')});
const newModal = new Modal(ensureElement('#modal-container'), events);

const formAdressPay = new FormAdressPay(cloneTemplate('#order'));

const formEmailPhone = new FormForContacts(cloneTemplate('#contacts'));

const newPage = new Page(document.body, events);

const newSuc = new Success(cloneTemplate('#success'));



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
    modalCards.cardsItem.forEach((item : IProductFull)=>{
        const newCard = new GalleryCardView(cloneTemplate('#card-catalog'), 
                                            events,
                                                () =>{events.emit('cardGalaryClicked', item);
                                                    console.log(item);
                                                }
                                            );
        newPage.gallery = newCard.render(item as IProductGalery) as HTMLButtonElement;
    });
    newPage.basketCount = basketModel.getCountBasket().toString();
    newPage.render();
})

// клик по карточек с удалением слушателя
events.on('cardGalaryClicked', (item: IProductFull)=>{
    const  newCardPrev = new PrevCardView('#card-preview', events, () => {events.emit('sendToBasket', item)});
    const isCardInBasket =  basketModel.getBasketItems().some(prod => prod.id === item.id)
    newCardPrev.buttonToBasket = !isCardInBasket
    newModal.content = newCardPrev.render(item); 
    newModal.render();
    newModal.open();
});


// добавление товара в корзину
events.on('sendToBasket', (item: IProductFull) => {
    if(!basketModel.getBasketItems().some(prod => prod.id === item.id)){
        const ItemToBasket : IProductBasket = {
            'id' : item.id,
            'price' : item.price,
            'title' : item.title
        }
        basketModel.addProductToBasket(ItemToBasket);
        newPage.basketCount = basketModel.getCountBasket().toString();
    }
})

// клик по корзине
events.on('basketClicked', ()=>{
    const basketItems = basketModel.getBasketItems();

    // Отображение товаров в корзине и событие их удаления
    newBasket.items  = basketItems.map((item)=>{
        const newCardBasket = new CardBasket(cloneTemplate('#card-basket'), events, (id: string) => {
            events.emit('basketDeleteItem', { id: id });
        });
        newCardBasket.index = basketItems.indexOf(item) + 1;
        return newCardBasket.render(item);
    })

    const isBasketClear = basketItems.length === 0 || basketModel.getSumOfProducts() === 0;
    newBasket.basketBtn = isBasketClear;
    
    newBasket.title = isBasketClear ? 'Корзина пуста' : 'Корзина';
    newBasket.price = basketModel.getSumOfProducts();

    newModal.content = newBasket.render();
    newModal.render();
    newModal.open();
})

// удаление карточки из корзины
events.on('basketDeleteItem', ({id} : {'id': string})=>{
    basketModel.removeProductFromBusket(id);
    newPage.basketCount = basketModel.getCountBasket().toString();
    events.emit('basketClicked');
})

// // сохрарнеие товара и суммы для оформления + событие откртия формы адреса и способа оплаты
// events.on('createOrder',()=>{
//     events.emit('openFormFirst'); 
// })


events.on('openFormFirst',() => {
    modelOrder.clearAdressPay();
    formAdressPay.clearForm();
    newModal.content = formAdressPay.render();
    newModal.render();
    newModal.open();
})

// ФОРМА АДРЕСА И СПОСОБА ОПЛАТЫ
    // НАЧАЛО
// способ оплаты в модель
events.on('sendPay', (btn : HTMLButtonElement)=>{ 
    modelOrder.payment = btn.name;
    modelOrder.validateFormAdressPay();
});
// адрес в модель

events.on('sendAddress', (addressInput : HTMLInputElement) => {
    modelOrder.setInputAddress(addressInput.value);
    modelOrder.validateFormAdressPay();
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
    modelOrder.clearEmailPhone();
    formEmailPhone.clear();
    newModal.content = formEmailPhone.render();
    newModal.render();
    newModal.open();
})

events.on('sendEmail', (formEmailInput : HTMLInputElement) =>{
    modelOrder.setInputEmail(formEmailInput.value);
    modelOrder.validateFormEmailPhone();
})

events.on('sendPhone', (phone :{num : string})=>{
    modelOrder.setInputNumb(phone.num);
    modelOrder.validateFormEmailPhone();
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
    modelOrder.total= basketModel.getSumOfProducts();
    modelOrder.items= basketModel.getBasketItems().filter(item => item.price !== null).map(item => item.id);
    productsListApi.postOrder(modelOrder.getOrderFull())
        .then((res)=>{
            newSuc.orderSuccessDescription = res.total;
            newModal.content = newSuc.render();
            basketModel.clear(); // Вызываем clear()
            newPage.basketCount = basketModel.getCountBasket().toString();
            newModal.render();
            newModal.open();
        })
        .catch((res)=>{
            console.log(res);
        })
})

// закрытие успеха
events.on('closeSucBtn', ()=>{
    basketModel.clear();
    newPage.basketCount = basketModel.getCountBasket().toString();
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

