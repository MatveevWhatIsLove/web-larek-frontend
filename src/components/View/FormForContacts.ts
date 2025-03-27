import { IForm } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { events } from "../base/events";

export class FormForContacts extends Component<IForm>{
    protected _inputArr : HTMLInputElement[];
    protected _inputEmail : HTMLInputElement;
    protected _inputPhone : HTMLInputElement;
    protected _payBtn : HTMLButtonElement;
    formErrors : HTMLSpanElement;
    protected _email : string;
    protected _phone : string;

    constructor (container : HTMLElement){
        super(container);
        // this._inputArr = ensureAllElements('form__input', this.container) as HTMLInputElement[];
        this._inputEmail = this.container.querySelector('[name="email"]');
        this._inputPhone = this.container.querySelector('[name="phone"]');
        this._payBtn = ensureElement('.button', this.container) as HTMLButtonElement;
        this.formErrors = ensureElement('.form__errors', this.container);

        this._inputEmail.addEventListener('input', ()=>{
            events.emit('sendEmail', (this._inputEmail));
            
        });

        

        this._inputPhone.addEventListener('input', ()=>{
            this._inputPhone.value = this.formatPhoneNumber(this._inputPhone.value);
            events.emit('sendPhone', {num : this._inputPhone.value});
        });

        this._payBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            events.emit('sendOrder');
        })

    }

    private formatPhoneNumber(value: string): string {
        const noAbs = value.replace(/\D/g, '');

        const maxLength = 11;
        const num = noAbs.slice(0, maxLength);

        let formatted = '';
        if (num.length > 0) {
            formatted = `+7(`;
            if (num.length > 1) {
                formatted += `${num.slice(1, 4)}`;
            }
            if (num.length > 4) {
                formatted += `)${num.slice(4)}`;
            }
        }

        return formatted;
    }

    showErrors(errors : {email: string, number : string}){
        let errorsText = '';
        for(const [key, value] of Object.entries(errors)){
            if(value !== ''){
                errorsText += `${value}   `;
            }
        }
        this.setText(this.formErrors, errorsText);
    }

    switchBtn(res : boolean){
        this.setDisabled(this._payBtn, res);
    }

    clear(){
        this._inputEmail.value = '';
        this._inputPhone.value = '';
        this.setText(this.formErrors, '');
        this.switchBtn(true);
    }
}