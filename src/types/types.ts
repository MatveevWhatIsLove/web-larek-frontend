export type IProductsFromApi = {
    total: number,
    items: IProductFull[];
}

export type orderList = {
    total: number,
    items: string[]
}

export interface ImodalBasket{
    addProductToBasket(item:IProductBasket): IProductBasket[];
    removeProductFromBusket(itemId : string):IProductBasket[];
    getSumOfProducts(): number;
    getCountBasket():number;
    getBasketItems():IProductBasket[];
    clear():void;
}

export interface IProductBasket 
{ 
    id: string, 
    price: number|null, 
    title: string,
    index?: number
};

export interface IProductGalery
{
    id: string, 
    price:number|null, 
    title: string
    image: string,
    category: string
}

export interface IProductFull
{
    id: string, 
    price:number|null, 
    title: string
    image: string,
    category: string,
    description: string,
    buttonToBasket : boolean
}

export interface IOrder {
    payment: string, 
    email: string,  
    phone: string 
    address: string
    total: number,
    items: string[],
    getOrderFull(): {
        'payment' : string,
        'email' : string,
        'phone' : string,
        'address' : string,
        'total' : number,
        'items' : string[]
    }
}


export interface ISuccess{
    orderSuccessDescription: number;
}

export interface IForm{
    validateForm(): void;
    onSubmit(data: any): void;
}

export interface IBasketView {
    title : string,
    basketBrn : boolean,
    items: HTMLElement[],
    price : number
}

export interface IModal{
    open(): void;
    close(): void;
}

export  interface cardCreated  {
    'cardFullInfo' : IProductFull[],
    'cardsGallaryHTML' : HTMLElement[]
};

export interface IPostOrder {
    'payment' : 'online' | 'ofline',
    'email' : string,
    'phone' : string,
    'address' : string,
    'total' : number,
    'items' : string[];
}

export interface IItemToCardCreated{
    'item': HTMLElement | HTMLElement[],
    'elemToSet' : HTMLElement
}

export interface order {
    payment: string, 
    email: string,  
    phone: string 
    address: string
    total: number,
    items: string[]
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IPage {
    galary : HTMLElement;
    basketCount : string;
}