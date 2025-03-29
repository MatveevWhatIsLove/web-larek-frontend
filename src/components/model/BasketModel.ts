import { IModelBasket, IProductBasket } from "../../types/types";

export class BasketModel implements IModelBasket{
    protected _productsInBasket: IProductBasket[];
    constructor(){
        this._productsInBasket = [];
    }
    addProductToBasket(item: IProductBasket){
        this._productsInBasket.push(item);
        return this._productsInBasket;
    }

    removeProductFromBusket(itemId : string) {
        this._productsInBasket = this._productsInBasket.filter(product => product.id !== itemId);
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

    getBasketItems(){
        return this._productsInBasket
    }

    clear(){
        this._productsInBasket = [];
    }
}

