import { IProductFull } from "../../types/types"
import { events } from "../base/events";

export class CardsModal{
    protected _cardsItem : IProductFull[];
    constructor(){
        this._cardsItem = []
    }

    set cardsItem(cardsItem : IProductFull[]){
        this._cardsItem = cardsItem;
        events.emit('dataLoaded');
    }

    get cardsItem(){
        return this._cardsItem;
    }
}