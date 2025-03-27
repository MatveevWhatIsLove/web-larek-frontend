import { IForm } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { events } from "../base/events";

export class FormAdressPay extends Component<IForm>{
    protected _orderButtons : HTMLDivElement;
    protected _btnCard : HTMLButtonElement;
    protected _btnCash : HTMLButtonElement;
    protected _btnBay : HTMLButtonElement[];
    protected _formInputArdess : HTMLInputElement;
    protected _orderButton : HTMLButtonElement;
    formErrors : HTMLSpanElement;
    // protected _payVar : string;
    // protected _ardess : string;

    constructor (container : HTMLElement){
        super (container);
        this._orderButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        this._orderButtons = ensureElement('.order__buttons', this.container) as HTMLDivElement;
        this._formInputArdess = ensureElement('.form__input', this.container) as HTMLInputElement;
        this._btnBay = ensureAllElements('.button_alt', this._orderButtons);
        this.formErrors = ensureElement('.form__errors', this.container);
        
        this._btnBay.forEach((btn)=>{
            btn.addEventListener('click', ()=>{
                this.payVar = btn.name;
                events.emit('sendPay', (btn));
            })
        })

        this._formInputArdess.addEventListener('input', ()=>{
            events.emit('sendAddress', (this._formInputArdess));
        })

        this._orderButton.addEventListener('click', (e)=>{
            e.preventDefault();
            events.emit('openSecondForm');
        })

    }

    set payVar(name : string){
        this._btnBay.forEach((btn)=>{
            btn.classList.toggle('button_alt-active', btn.name === name);
        })
    }

    clearForm(){
        this._btnBay.forEach((btn)=>{
            if(btn.classList.contains('button_alt-active')){
                btn.classList.remove('button_alt-active');
            }
        })
        this._formInputArdess.value = '';
        this.setText(this.formErrors, '');
        this.switchBtn(true);
    }

    showErrors(errors : {address: string}){
        this.setText(this.formErrors, errors.address);
    }

    switchBtn(res : boolean){
        this.setDisabled(this._orderButton, res);
    }

}