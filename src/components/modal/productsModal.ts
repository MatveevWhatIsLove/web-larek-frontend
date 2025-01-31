import { IProduct, IProducts } from '../../types/index';
import { IEvents } from '../base/events';

export class Products implements IProducts {

    protected _products: IProduct[];
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    };

    // установка продуктов и событие установки
    set products(products:IProduct[]) {
        this._products = products;
        console.log('продукты');
        this.events.emit('products:set')
    };

    // получение
    get products () {
        return this._products;
    };
    // получение по id
   getProduct(productId: string): IProduct {
      return this._products.find((item) => item.id === productId);
    };
}