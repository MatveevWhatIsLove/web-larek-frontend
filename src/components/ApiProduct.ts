
// ApiModal
import {Api, ApiListResponse} from './base/api';
import{IProduct, IOrder, IProducts} from '../types/index';
import {API_URL, CDN_URL, settings} from '../utils/constants';
import { events } from './base/events';


// тип ответа сервера на продукт
type TProductListApi = {
    total : number,
    items : IProduct[]
}

// Массив продуктов с сервера
export class ApiProduct extends Api{
    // ссылка на картинку товара
    readonly cdn: string;

    constructor(baseUrl: string, options: RequestInit, cdn: string){
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // get запрос на получение промиса продуктов:TProductListApi, + изменение item.image.
    getProductList(): Promise<ApiListResponse<IProduct>>{
        return this.get('/product/')
        .then((itemList : TProductListApi) => ({
            ...itemList,
            items: itemList.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }))
        }))

    }
    // получение по id
    getProductById(id: string):Promise<IProduct>{
        return this.get(`/product/${id}`)
        .then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image
        }))
    }
}

export const api = new ApiProduct(API_URL,  settings, CDN_URL);


// testApiProductList.getProductList().then(productList => {
//     console.log(productList);
// });