
interface IProduct{
    id: string,
    description: string,
    image: string, 
    title: string  ,          
    category: string, 
    price: number
}

type TProductCard = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

type TProductModal = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>

type TProductBasket = Pick <IProduct, 'title' | 'price'>


interface IOrder{
    payment: TPaymentType,
    email: string , 
    phone: string,
    address: string,   
    total: number,  
    items: string[]
}

type TPaymentType = 'Online' | 'Offline'


type TOrderAddPay = Pick<IOrder, 'payment' | 'address'>


type TOrderMailNum = Pick<IOrder, 'phone' | 'email'>


type TApiMethod = 'GET' | 'POST'
                
interface IProductSettings{  
    image: string, 
    category: string,
    title: string,
    text: string,     
    price: number,
    formatClass: string,
    isModal: boolean,
    isBasket: boolean
}