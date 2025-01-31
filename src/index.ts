import './scss/styles.scss';
import { ApiProduct , testApiProductList} from './components/ApiProduct';
import { Products } from './components/modal/productsModal';
import { productMainView } from './components/View/productMianView';
import { EventEmitter } from './components/base/events';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter;
const products = new Products(events);

testApiProductList.getProductList().then(productList => {
    console.log(productList);
    products.products
})

