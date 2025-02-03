import './scss/styles.scss';
import { ApiListResponse } from './components/base/api';
import { api } from './components/ApiProduct';
import { CardModal } from './components/modal/CardModal';
import { CardMainView } from './components/View/CardMainView';
import { events } from './components/base/events';
import { cloneTemplate } from './utils/utils';
import { ensureElement } from './utils/utils';


const cardModal = new CardModal(events);

const productMainTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

api.getProductList()
    .then(productObj => {
        console.log(productObj);
        cardModal.setProducts(productObj);
    })

events.on('product:set', ()=>{
       cardModal.products.forEach(item => {
        console.log(item);
            const newCard = new CardMainView(cloneTemplate(productMainTemplate), events).render(item);
            console.log(newCard);
            document.querySelector('.gallery').appendChild(newCard);
       })
       
})
