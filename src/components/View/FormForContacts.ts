import { IForm } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class FormForContacts extends Component<IForm>{
    protected _inputArr : HTMLInputElement[];
    protected _inputEmail : HTMLInputElement;
    protected _inputPhone : HTMLInputElement;
    protected _payBtn : HTMLButtonElement;
    protected _formErrors : HTMLSpanElement;
    protected _email : string;
    protected _phone : string;
    protected _onSubmit : (data:{_email : string, _phone : string}) => void;

    constructor (container : HTMLElement, onSubmit:(data:{_email : string, _phone : string}) => void){
        super(container);
        this._onSubmit = onSubmit;
        // this._inputArr = ensureAllElements('form__input', this.container) as HTMLInputElement[];
        this._inputEmail = this.container.querySelector('[name="email"]');
        this._inputPhone = this.container.querySelector('[name="phone"]');
        this._payBtn = ensureElement('.button', this.container) as HTMLButtonElement;
        this._formErrors = ensureElement('.form__errors', this.container);

        this._inputEmail.addEventListener('input', ()=>{
            this._email = this._inputEmail.value;
            
            this.validateFormEmailPhone(this._phone, this._email)
        });

        

        this._inputPhone.addEventListener('input', ()=>{
            this._inputPhone.value = this.formatPhoneNumber(this._inputPhone.value);
            this._phone = this._inputPhone.value;
            // console.log(this._phone);
            this.validateFormEmailPhone(this._phone, this._email);
        });

        this._payBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            this._onSubmit({_email : this._email, _phone : this._phone});
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

    validateFormEmailPhone(valuePhone : string, valueEmail : string){
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^\+7\(\d{3}\)\d{7}$/;

        if(!phonePattern.test(valuePhone) && !emailPattern.test(valueEmail)){
            this.setDisabled(this._payBtn, true);
            this.setText(this._formErrors, 'Ведите корректные данные');
        } else if(phonePattern.test(valuePhone) && !emailPattern.test(valueEmail)){
            this.setDisabled(this._payBtn, true);
            this.setText(this._formErrors, 'Ведите корректную почту');
        } else if(!phonePattern.test(valuePhone) && emailPattern.test(valueEmail)){
            this.setDisabled(this._payBtn, true);
            this.setText(this._formErrors, 'Ведите корректный номер. Пример: +7(XXX)XXXXXXX');
        } else if(phonePattern.test(valuePhone) && emailPattern.test(valueEmail)){
            this.setText(this._formErrors, '');
            this.setDisabled(this._payBtn, false);
        }
    }

}