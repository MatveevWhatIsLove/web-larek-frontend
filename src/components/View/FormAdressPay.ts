import { IForm } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement, ensureAllElements } from "../../utils/utils";

export class FormAdressPay extends Component<IForm>{
    protected _orderButtons : HTMLDivElement;
    protected _btnCard : HTMLButtonElement;
    protected _btnCash : HTMLButtonElement;
    protected _btnBay : HTMLButtonElement[];
    protected _formInputArdess : HTMLInputElement;
    protected _orderButton : HTMLButtonElement;
    protected _formErrors : HTMLSpanElement;
    protected _payVar : string;
    protected _ardess : string;
    protected _onSubmit : (data:{_payVar : string, _ardess : string}) => void;

    constructor (container : HTMLElement, onSubmit:(data:{_payVar : string, _ardess : string}) => void){
        super (container);
        this._onSubmit = onSubmit;
        this._orderButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        this._orderButtons = ensureElement('.order__buttons', this.container) as HTMLDivElement;
        this._formInputArdess = ensureElement('.form__input', this.container) as HTMLInputElement;
        this._btnBay = ensureAllElements('.button', this._orderButtons);
        this._formErrors = ensureElement('.form__errors', this.container);
        this._orderButtons.addEventListener('click', (e)=>{
            // this.validateFormPayAdress();
            if(e.target instanceof HTMLButtonElement && e.target.classList.contains('button')){
                const clickedButtonName = e.target.getAttribute('name');
                this._btnBay.forEach((btn)=>{
                    const btnName = btn.getAttribute('name');
                    if(btnName === clickedButtonName){
                        btn.classList.add('button_alt-active');
                        this._payVar = btn.textContent;
                        this.validateFormPayAdress();
                    } else{
                        btn.classList.remove('button_alt-active');
                    }
                })
            }
        });

        this._formInputArdess.addEventListener('input', ()=>{
            this._ardess = this._formInputArdess.value;
            this.validateFormPayAdress();
            // this.validateFormPayAdress()
        })

        this._orderButton.addEventListener('click', (e)=>{
            e.preventDefault();
            this._onSubmit({_payVar : this._payVar, _ardess : this._ardess});
        })
    }

    validateFormPayAdress(){
        // this._ardess = this._formInputArdess.value;
        if(!this._payVar && !this._ardess){
            this.setDisabled(this._orderButton, true);
            this.setText(this._formErrors, 'Выберите способ оплаты и введите адрес доставки');
        }else if(this._payVar && !this._ardess){
            this.setText(this._formErrors, 'Введите адрес доставки');
            console.log('адрес');
            this.setDisabled(this._orderButton, true);
        }else if(!this._payVar && this._ardess){
            this.setText(this._formErrors, 'Выберите способ оплаты');
            console.log('оплата');
            this.setDisabled(this._orderButton, true);
        }else if(this._payVar && this._ardess){
            this.setText(this._formErrors, '');
            this.setDisabled(this._orderButton, false);
        }
    }

}