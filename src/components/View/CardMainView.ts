import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CardView } from "./CardView";
import { CDN_URL } from "../../utils/constants";
import { ColorCategory } from "../../utils/constants";

export class CardMainView extends CardView{

    constructor (container: HTMLElement, events : IEvents){
        super(container);

        this.category = ensureElement('.card__category', this.container);
        this.image = ensureElement('.card__image', this.container) as HTMLImageElement;

    }

}