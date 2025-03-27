import { IOrder } from "../../types/types";
import { events } from "../base/events";

export class orderModal implements IOrder{
    protected _payment: string;
    protected _email: string;
    protected _phone: string ;
    protected _address: string;
    protected _total: number;
    protected _items: string[];
    error : {
        address : string,
        pay : string,
        number : string,
        email : string
    };

    constructor(){
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
        this._total = 0;
        this._items = [];
        this.error = {
            address : '',
            pay : '',
            number : '',
            email : ''
        };
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

    setInputAddress(addressInputValue : string){
        if(this.validateAddress(addressInputValue)){
            this.address = addressInputValue;
        } else {
            this.address = '';
        }
    }

    private validateAddress(addressInputValue : string) : boolean{
        const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{12,}$/;
        let result;
        if(!addressInputValue){
            this.error.address = 'Введите адрес!';
            result = false
        } else if(!regexp.test(addressInputValue)){
            this.error.address = 'Введите адрес верно!'
            result = false
        } else { 
            this.error.address = '';
            result = true
        }
        return result;
    }

    validateFormAdressPay(){
        if(this._address && this._payment){
            events.emit('formArdessTrue', (this.error));
        } else{
            events.emit('showErrorsArdess', (this.error));
        }
    }

    clearAdressPay(){
        this.address = '';
        this.payment = '';
        this.error.address = '';
    }



    setInputEmail(emailInputValue : string){
        if(this.validateEmail(emailInputValue)){
            this.email = emailInputValue;
        } else {
            this.email = '';
        }
    }

    private validateEmail(emailInputValue : string): boolean{
        const regexp = /^[a-zA-Z0-9-\.]+@([a-zA-Z-]+\.)+[a-zA-Z-]+$/;
        let result;
        if(!emailInputValue){
            this.error.email = 'Введите почту!';
            result = false
        } else if(!regexp.test(emailInputValue)){
            this.error.email = 'Введите верную почту!';
            result = false
        }else {
            this.error.email = '';
            result = true
        }
        return result;
    }


    setInputNumb(numberInputValue : string){
        if(this.validateNumber(numberInputValue)){
            this.phone = numberInputValue;
        } else {
            this.phone = '';
        }
    }    


    private validateNumber(numberInputValue : string) : boolean{
        const regex = /^\+7\(\d{3}\)\d{7}$/
        let result;
        if(!numberInputValue){
            this.error.number = 'Введите номер телефона! ';
            result = false;
        } else if(!regex.test(numberInputValue)){
            this.error.number = 'Введите верный номер телефона формата +7(xxx)xxxxxxx! ';
        } else{
            this.error.number = '';
            result = true;
        }
        return result
    }


    validateFormEmailPhone(){
        if(this._email && this._phone){
            events.emit('formArdessTrueFormEmailPhone', (this.error));
        } else{
            events.emit('showErrorsFormEmailPhone', (this.error));
        }
    }

    clearEmailPhone(){
        this.email = '';
        this.phone = '';
        this.error.email = '';
        this.error.number = '';
    }

}