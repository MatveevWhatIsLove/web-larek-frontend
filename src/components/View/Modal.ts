import { IModal } from "../../types/types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Modal extends Component<IModal>{
    protected _closeBtn : HTMLButtonElement;
    protected _content : HTMLDivElement;
    protected _pageWrap : HTMLDivElement;
    
    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        this._closeBtn = ensureElement('.modal__close', this.container) as HTMLButtonElement;
        this._content = ensureElement('.modal__content', this.container) as HTMLDivElement;
        this._pageWrap = document.querySelector('.page__wrapper') as HTMLDivElement;

        this._closeBtn.addEventListener('click', (e)=>{
            if((e.target instanceof HTMLButtonElement && e.target.classList.contains('modal__close'))){
                this.close();
            }
        })

        this.container.addEventListener('click', (e)=>{
            if(e.target instanceof HTMLDivElement && e.target.classList.contains('modal_active')){
                this.close();
            }
        })

        window.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape'){
                this.close();
            }
        })
    }

    set content(elem: HTMLElement){
        this._content.replaceChildren(elem);
    }

    get content(){
        return this._content;
    }

    open(){
        this.container.classList.add('modal_active');
        this.events.emit('modalOpen');
    }

    close(){
        this._content.replaceChildren();
        this.container.classList.remove('modal_active');
        this.events.emit('modalClose');
    }
}
