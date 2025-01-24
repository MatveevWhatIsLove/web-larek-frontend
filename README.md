# Проектная работа "Веб-ларек"
## **1**
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

## **2 Установка и запуск**
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
## **Данные и типы данных в приложении**
### Данные продуктов из API (GET)
`interface IProduct{
    id: string,
    description: string,
    image: string, 
    title: string,            
    category: string, 
    price: number | null
}`

#### Данные товра на главной странице
`type TProductCard = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;`

#### Данные товара в модальном окне
`type TProductModal = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>`

#### Данные товара в корзине
`type TProductBasket = Pick <IProduct, 'title' | 'price'>`

### Данные для заказа в API(POST)
`interface IOrder{
    payment: TPaymentType,
    email: string, 
    phone: string,
    address: string,   
    total: number | null,  
    items: string[]
}`
#### Тип оплты
`type TPaymentType = 'Online' | 'Offline'`

#### Модальное окно с методом оплаты и адресом
`type TOrderAddPay = Pick<IOrder, 'payment' | 'address'>`

#### Модальное окно с вводом почты и номера
`type TOrderMailNum = Pick<IOrder, 'phone' | 'email'>`

### Методы для API 
`type TApiMethod = 'GET' | 'POST'`

### Типы данных для настроек отображения из верстки
#### Товары                   
`interface IProductSettings{  
    image: string, 
    category: string,
    title: string,
    text: string,     
    price: number | null
    ,
    formatClass: string,
    isModal: boolean,
    isBasket: boolean
}`

## **Архитектура приложения**
    В архитектуре используется принцип **MVP**: логика работы с данными, представлением и взаимодействием между ними четко разделена.
        **Model** - отвечает за хранение и обработку данных
        **View** - отвечает за отображенние данных на странице
        **Presenter** - отвечает за связь между View и Model. 
    Брокер событий инициализирует события View, вызывая методы Model, которые 'работают' над данными и после вызываются методы View, чтобы отобразить результаты/изменения. Получается, что основная логика находится в Presenter'е.




## **Model**

### 1 API
    #### 1.1 Класс Api
        Данный класс является основой для работой с сервером. Класс принимает базовый URl и объект.
        Класс Api содержит методы:
            -get - выполняет запрос на сервер по базовому url + uri и возвращает объект, которым ответил сервер
            -post - выполняет запрос на сервер по базовому url + uri, метод запроса изменяем и зависит от параметра `ApiPostMethods`, а вторым параметром в эту функцию передается объект, который приобразуется в JSON.

    #### 1.2 Модель ApiProducts
        Модель, которая наследует Api, в нем имеется функция, которая возвращает промис товаров

        `getProducts():Promis<Products[]>`

    #### 1.3 Модель ApiOrder
        Модель, которая наследует Api, и она должна отправлять запрос на сервер с данными заказа(IOrder), также должна вернуться сумма, сколько списалось, и id заказа

        postOrder(order: IOrder):Promise<{ id: string, total: number }>

    #### 1.4 Модель Product
        В этой модели должен храниться массив карточек с сервера согласно интерфейсу IProduct

        items:Array<IProduct>

    #### 1.5 Модель корзины
        В данной модели хрянтся данные товаров(согласно типу TProductBasket) и сумма, методы, которые позваляют добавлять их, удалять, указывать номера(кол-во), считать стоимость. Добавление и удаление удобнее делать по id. Валидация корзины, чтобы вкл/выкл конпки

        items: Array<TProductBasket> = []
        price: number = 0

        addProduct(id):void - добавление в корзину
        deleteProduct(id):void - удаление из корзины
        countPrice():void - Сумма
        countProduct(items: Array<TProductBasket>):void - кол-во товаров
        validationBasket(items: Array<TProductBasket>):boolean
    #### 1.6 Модель заказа
        В данной модели происходит хранние данных вводимых пользователям для заказа, сумма заказа и массив товаров. хранится все в объекте интерфейсом IOrder. товары также хранятся по id. Также здесь должна быть валидация.

        order: IOrder = {}
        payment: TPaymentType,
        email: string, 
        phone: string,
        address: string,   
        total: number,  
        items: string[]
        
        validatePaymentAddress():boolean
        setPaymentAddress(TOrderAddPay):void
        validateEmailPhone():boolean
        setEmailPhone(TOrderMailNum):void

## **View**
    #### 1.1 отображение universalElement
        Это отображение является универсальным для всех отображений: 
            страница(кол-во товаров в корзине, товары), 
            сами товары в каталоге, 
            товары в предпросмотре, 
            товары в корзине, 
            модальное окно корзины, 
            модальное окно форм(тоже универсальный):
                -форма выбора оплаты и ввода адреса
                -форма ввода почты и телефона
            модальное окно успешного закзаа

    universalElement должен сожержать в себе рендер и контейнер, куда будет складываться контент.

    container:HTMLElement - контейнер

    render(data: <T>):HTMLElement - Универсальный рендер

    #### 1.2 Product - универсальный класс для товаров(наследник universalElement)

    Поля: 
        price, title отображаются во всех видах изображения товара, они обязательные, все остальные опциональны
        price:HTMLElement
        title: HTMLElement
        category?:HTMLElement
        image?:HTMLElement
        description?:HTMLElement
    Методы:

        price(price: number | null) - вставка цены, если null, то "бесценно"
        title(title:string) - вставка заголовка
        
        
        

        render(product:IProduct) - рендер

    #### 1.2 ProductCatalog - класс наследник Product

        
        метод category(category:string) - вставка категории
        image(image:string) - вставка картинки
    #### 1.3 ProductCheck - класс наследник Product

        category(category:string)
        description(description: string) - вставка описания
        image(image:string) - вставка картинки
    #### 1.4 ProductBasket - класс наследник Product

        count(value:num) - номер товара в корзине

    #### 1.5 Modal - общий класс для модальных окон наслежник universalElement
        content(element: HTMLElement)
        open():void
        close()void
        render():void



    #### 1.6 form - общий класс для формы, наследник Modal

        subBtn:HTMLButton - конопка отправки(далее)

        метод toggleButton - переключение статуса кнопки

    #### 1.7 formOrderPaymentAddress - наследник form

        onlineBtn: HTMLButton,
        offlineBtn: HTMLButton,
        payment: TPaymentType, - сохранение выбора оплаты
        address: HTMLInputElement

        методы: 

        setPayment - сохраняяет способ оплаты
        setAddress - сохраняет адресс
        validation(onlineBtn: HTMLButton, offlineBtn: HTMLButton, address: HTMLInputElement) - валидация
    #### 1.8 formEmailNumber - - наследник form

        email: HTMLInputElement, 
        phone: HTMLInputElement,

        методы

        setEmail - сохраняяет email
        setPhone - сохраняет номер
        validation(email: HTMLInputElement, phone: HTMLInputElement,) - валидация
    
    #### 1.9 succesForm - класс наслденик Modal
        succesBtn:HTMLElement - кнопка успеха
        descr: HTMLElement - поле вставки текста успеха

        метод
         render(data:{number}) - рендер со суммой списания

    #### 1.10 basket - корзина наследник Modal
        list: HTMLElement - список товаров
        total: HTMLElement - общая сумма
        button: HTMLButtonElement - кнопка для оформления

        мметоды

        items(items: HTMLElement[]) - заполнение корзины
        price(num: number) - вставка общей суммы
        toggleBtn - изменение кнопки(если пусто в корзине, то блокировка)
    #### 1.11
        Page - класс страницы наследник universalElement

        counter: HTMLElement - кол-во в корзине
        productsWrap: HTMLElement - обертка для товаров

    
       counter(value: number) - установка кол-ва в корзине
       catalog(items: HTMLElement[]) - вставка на страницу товары
       
## Presenter
    EventEmitter - связь между modal и view. работа с событиями

    Установить обработчик на событие
    on<T extends object>(eventName: EventName, callback: (event: T) => void)

    Снять обработчик с события
    off(eventName: EventName, callback: Subscriber)

    Инициировать событие с данными
    emit<T extends object>(eventName: string, data?: T)

    Слушать все события
    onAll(callback: (event: EmitterEvent) => void)

    Сбросить все обработчики
    offAll()

    Сделать коллбек триггер, генерирующий событие при вызове
    trigger<T extends object>(eventName: string, context?: Partial<T>)
