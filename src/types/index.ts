


export interface IProduct{
    id: string,
    description: string,
    image: string, 
    title: string  ,          
    category: string, 
    price: number
}

export interface IProducts{
    products: IProduct[];
    getProduct(productId: string): IProduct;
}

export type TProductCard = Pick<IProduct, 'id' | 'category' | 'title' | 'image' | 'price'>;

export type TProductModal = Pick<IProduct, 'id' | 'category' | 'title' | 'description' | 'image' | 'price'>

export type TProductBasket = Pick <IProduct, 'id' | 'title' | 'price'>


export interface IOrder{
    payment: TPaymentType,
    email: string , 
    phone: string,
    address: string,   
    total: number,  
    items: string[]
}

export type TPaymentType = 'Online' | 'Offline'


export type TOrderAddPay = Pick<IOrder, 'payment' | 'address'>


export type TOrderMailNum = Pick<IOrder, 'phone' | 'email'>


export type TApiMethod = 'GET' | 'POST'
                
export interface IProductSettings{  
    image: string, 
    category: string,
    title: string,
    text: string,     
    price: number,
    formatClass: string,
    isModal: boolean,
    isBasket: boolean
}