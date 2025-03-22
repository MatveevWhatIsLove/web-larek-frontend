import './scss/styles.scss';

import {ensureElement,
        cloneTemplate} from './utils/utils'

import {API_URL, CDN_URL, settings} from './utils/constants';

import {events} from './components/base/events';

import { ProductApi } from './components/modal/ProductApi';
const productsListApi = new ProductApi(API_URL, settings, CDN_URL);

import { orderList, IOrderResult, IProductFull, IProductBasket, IProductsFromApi, IProductGalery } from './types/types';

import { ModalBasket } from './components/modal/ModalMasket';
const BasketModal = new ModalBasket;

import { CardBasket } from './components/View/CardBasket';

import { GalleryCardView } from './components/View/GalleryCardView';

import { PrevCardView } from './components/View/PrevCardView';

import { orderModal } from './components/modal/orderModal';
const modalOrder = new orderModal();

import { Success } from './components/View/Success';

import { FormForContacts } from './components/View/FormForContacts';

import { FormAdressPay } from './components/View/FormAdressPay';

import { BasketView } from './components/View/BasketView';

import { Modal } from './components/View/Modal';


events.on('basketClicked', ()=>{
    const newBasket = new BasketView(cloneTemplate('#basket'), ()=>{events.emit('createOrder')});
    const BasketItems = BasketModal.getBasketItems();
    // Генерация корзины
    newBasket.items  = BasketItems.map((item)=>{
        const newCardBasket = new CardBasket(cloneTemplate('#card-basket'), events, (id: string) => {
            events.emit('basketDeleteItem', { id: id });
        });
        newCardBasket.index = BasketItems.indexOf(item) + 1;
        return newCardBasket.render(item);
    })
    const IsBasketClear = BasketItems.length === 0 || BasketModal.getSumOfProducts() === 0;
    newBasket.basketBrn = IsBasketClear;
    
    newBasket.title = IsBasketClear ? 'Корзина пуста' : 'Корзина';
    newBasket.price = BasketModal.getSumOfProducts();
    const newModal = new Modal(ensureElement('#modal-container'), events);
    newModal.content = newBasket.render();
    newModal.render();
    newModal.open();
})

events.on('basketDeleteItem', ({id} : {'id': string})=>{
    BasketModal.removeProductFromBusket(id);
    events.emit('basketClicked');
})


events.on('createOrder',()=>{
    const orderItems : orderList = {
        total : BasketModal.getSumOfProducts(),
        items : BasketModal.getBasketItems().filter(item => item.id !== 'b06cde61-912f-4663-9751-09956c0eed67').map(item => item.id)
    }
    modalOrder.total= orderItems.total;
    modalOrder.items= orderItems.items;
    events.emit('openFormFirst'); 
})


events.on('openSucsec', (res : IOrderResult)=>{
    const newModal = new Modal(ensureElement('#modal-container'), events);
    const newSuc = new Success(cloneTemplate('#success'));
    newSuc.orderSuccessDescription = res.total;
    const newSucrendered  = newSuc.render();
    newSucrendered.querySelector('.order-success__close').addEventListener('click', ()=>{
        BasketModal.clear();
        newModal.close();
    })
    const originalClose = newModal.close.bind(newModal); // Сохраняем оригинальный метод
    newModal.close = function() {
        BasketModal.clear(); // Вызываем clear()
        originalClose(); // Вызываем оригинальный метод close
        newModal.close = originalClose;
    };
    newModal.content = newSucrendered;
    newModal.render();
    newModal.open();
})

events.on('openSecondForm', ()=>{
    const newModal = new Modal(ensureElement('#modal-container'), events);
    const formEmailPhone = new FormForContacts(cloneTemplate('#contacts'),(data)=>{
        console.log('Данные формы:', data);
        modalOrder.email = data._email;
        modalOrder.phone = data._phone;
        console.log(modalOrder.getOrderFull());
        productsListApi.postOrder(modalOrder.getOrderFull())
            .then((result)=>{
                events.emit('openSucsec', result);
            })
    }).render();
    newModal.content = formEmailPhone;
    newModal.render();
    newModal.open();
})

events.on('openFormFirst',() => {
    const newModal = new Modal(ensureElement('#modal-container'), events);
    const formAdressPay = new FormAdressPay(cloneTemplate('#order'), (data)=>{
        console.log('Данные формы:', data);
        modalOrder.address = data._ardess;
        modalOrder.payment = data._payVar;
        events.emit('openSecondForm');
    }).render();
    newModal.content = formAdressPay;
    newModal.render();
    newModal.open();
})

//Получение карточек и сработка слушателя, что данные полученны
productsListApi.getProdutList()
    .then(data => {
        events.emit('dataLoaded', (data));
    })

events.on('sendToBasket', (item: IProductFull) => {
    console.log(item.id);
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
    const newCardPrev = new PrevCardView(prevCard, events);
    const isCardInBasket =  BasketModal.getBasketItems().find((itemCard)=>{
        return itemCard.id === item.id;
    });
    newCardPrev.buttonToBasket = !isCardInBasket
    newModal.content =  newCardPrev.render(item); 
    
    console.log(item);
    const modalCardBtnToBasket = ensureElement('.button', newModal.content);
    modalCardBtnToBasket.addEventListener('click', ()=>{
        console.log('1', item);
        events.emit('sendToBasket', item);
    })

    newModal.render();
    newModal.open();
})

events.on('dataLoaded', (data:IProductsFromApi)=>{
    data.items.forEach((item : IProductFull)=>{
        const cardTemplate = cloneTemplate('#card-catalog');
        const newCard = new GalleryCardView(cardTemplate, events).render(item as IProductGalery);
        newCard.addEventListener('click', ()=>{
            events.emit('cardGalaryClicked', item);
        }) 
        document.querySelector('.gallery').appendChild(newCard);
    })
    document.querySelector('.header__basket-counter').textContent = BasketModal.getCountBasket().toString();
    document.querySelector('.header__basket').addEventListener('click', ()=>{
        events.emit('basketClicked');
    })
})