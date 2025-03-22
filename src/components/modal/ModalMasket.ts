import { ImodalBasket, IProductBasket } from "../../types/types";

// MODAL
export class ModalBasket implements ImodalBasket{
    protected _basketCount: HTMLSpanElement;
    protected _productsInBasket: IProductBasket[];
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

    removeProductFromBusket(itemId : string) {
        this._productsInBasket = this._productsInBasket.filter(product => product.id !== itemId);
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

    clear(){
        this._productsInBasket = [];
        this.setCountBasket();
    }
}

