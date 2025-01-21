# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные продуктов из API (GET)
interface IProduct{
    id: string,
    description: string,
    image: string, 
    title: string            
    category: string 
    price: number
}

### Данные товра на клавной странице
type TProductCard = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

### Данные товара в модальном окне
type TProductModal = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>

### Данные товара в корзине
type TProductBasket = Pick <IProduct, 'title' | 'price'>

## Данные для заказа в API(POST)
interface IOrder{
    payment: TPaymentType,
    email: string   
    phone: string
    address: string   
    total: number  
    items: string[]
}
### Тип оплты
type TPaymentType = 'Online' | 'Offline'

### Модальное окно с методом оплаты и адресом
type TOrderAddPay = Pick<IOrder, 'payment' | 'address'>

### Модальное окно с вводом почты и номера
type TOrderMailNum = Pick<IOrder, 'phone' | 'email'>

## Методы для API 
type TApiMethod = 'GET' | 'POST'

## Типы данных для настроек отображения из верстки
### Товары                   
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