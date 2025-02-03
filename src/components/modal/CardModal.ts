import { IProduct, IProducts } from "../../types";
import { IEvents } from "../base/events";
import { ApiListResponse } from "../base/api";

// Модель карточек: ИХ хранение, запись, получение.
export class CardModal implements IProducts{

    total: number;
    products: IProduct[];

    constructor (protected events : IEvents){}

    setProducts(data: ApiListResponse<IProduct>): void{
        this.total = data.total;
        this.products = data.items;
        this.events.emit('product:set');
    }

    getAllProduct(): IProduct[] {
        return this.products;
    }

    getProductById(productId: string): IProduct {
        return this.products.find((item) => 
            item.id === productId
    )}
}