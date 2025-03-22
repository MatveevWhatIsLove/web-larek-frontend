import { IOrder } from "../../types/types";

export class orderModal implements IOrder{
    protected _payment: string;
    protected _email: string;
    protected _phone: string ;
    protected _address: string;
    protected _total: number;
    protected _items: string[];

    constructor(){
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
        this._total = 0;
        this._items = [];
    }

    set payment(value : string){
        this._payment = value;
    }

    set email(value : string){
        this._email = value;
    }

    set phone(value : string){
        this._phone = value;
    }
    set address(value : string){
        this._address = value;
    }

    set total(value : number){
        this._total = value;
    }

    set items(value : string[]){
        this._items = value;
    }

    getOrderFull(){
        return {
            'payment' : this._payment,
            'email' : this._email,
            'phone' : this._phone,
            'address' : this._address,
            'total' : this._total,
            'items' : this._items
        }
    }
}