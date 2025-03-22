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


## **3 Функции, которые данны изначально**
### 1) Файл events
        1.1)
            on<T extends object>(eventName: EventName, callback: (event: T) => void) {
                if (!this._events.has(eventName)) {
                    this._events.set(eventName, new Set<Subscriber>());
                }
                this._events.get(eventName)?.add(callback);
            } 

            функция класса event подписки на события, где T - объект-событие.
            если на чем-то сейчас нет события, то он ставится.
            ставится обработчик

            используется функция так, к примеру загрузка файлов с сервера

            event.on('dataLoaded', (data)=>{
                console.log('данные загруженны:', data);
            })

            мы придумали событие dataLoaded и что будет происходить, когда оно сработает. Но сам по себе он не сработает.

        1.2)
            off(eventName: EventName, callback: Subscriber) {
                if (this._events.has(eventName)) {
                    this._events.get(eventName)!.delete(callback);
                    if (this._events.get(eventName)?.size === 0) {
                        this._events.delete(eventName);
                    }
                }
            }
            снятие слушателя
            аналогично с on, но результат - снятие 
        1.3) 
            emit<T extends object>(eventName: string, data?: T) {
                this._events.forEach((subscribers, name) => {
                    if (name === '*') subscribers.forEach(callback => callback({
                        eventName,
                        data
                    }));
                    if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                        subscribers.forEach(callback => callback(data));
                    }
                });
            }

            emit нужен для вызова слушателей, которые поставили.Он перебирает всех подписчиков на событие
            у нас есть dataLoaded

            после получения данных с сервера мы должны активировать слушатель dataLoaded.
            поэтому мы пишем event.emit('dataLoaded', data). Указали что произошло(dataLoaded) и данные которые передаем.
        1.4) 
            onAll(callback: (event: EmitterEvent) => void) {
                this.on("*", callback);
            }
            Подпишется сразу на все события events. 
        1.5) 
            offAll() {
                this._events = new Map<string, Set<Subscriber>>();
            }
            Отпишется
        1.6) 
            trigger<T extends object>(eventName: string, context?: Partial<T>) {
                return (event: object = {}) => {
                    this.emit(eventName, {
                        ...(event || {}),
                        ...(context || {})
                    });
                };
            }
            Удобно для отображения успеха, ошибок. Т е без работы с данными
            -Успех (success)
            -Ошибка (error)
            -Предупреждение (warning)
            -Начало или завершение процесса (loading, done)



### 2)Файл Components

        2.1)Переключения класса, element - где переключить, className - какой класс переключить, force:
            Если force задан как true
            Класс будет обязательно добавлен, независимо от того, есть он уже у элемента или нет.

            Если force задан как false.
            Класс будет обязательно удален, независимо от того, есть он у элемента или нет.

            toggleClass(element: HTMLElement, className: string, force?: boolean) {
                element.classList.toggle(className, force);
            }
        2.2)Установить текстовое содержимое
            protected setText(element: HTMLElement, value: unknown) {
                if (element) {
                    element.textContent = String(value);
                }
            }

        2.3)  // Сменить статус блокировки
            setDisabled(element: HTMLElement, state: boolean) {
                if (element) {
                    if (state) element.setAttribute('disabled', 'disabled');
                    else element.removeAttribute('disabled');
                }
            }
        2.4)    // Скрыть
            protected setHidden(element: HTMLElement) {
                element.style.display = 'none';
            }

        2.5)    // Показать
            protected setVisible(element: HTMLElement) {
                element.style.removeProperty('display');
            }

        2.6)   // Установить изображение с алтернативным текстом
            protected setImage(element: HTMLImageElement, src: string, alt?: string) {
                if (element) {
                    element.src = src;
                    if (alt) {
                        element.alt = alt;
                    }
                }
            }

        2.7) Рендер элемента. получает на вход объект.
            render(data?: Partial<T>): HTMLElement {
                Object.assign(this as object, data ?? {});
                return this.container;
            }

### 3) utils
        3.1) Преобразует строку из формата PascalCase (например, SomeText) в kebab-case (например, some-text).
        3.2) isSelector - роверка, является ли значение допустимым CSS-селектором. 
        3.3) isEmpty - Проверка, является ли значение null или undefined.
        3.4) ensureAllElements - Преобразование селектора, NodeList или массива в массив элементов. (все .btn)
        3.5) ensureElement - Получение одного элемента по селектору или проверка, что переданный элемент существует.
        3.6) cloneTemplate - Клонирование содержимого HTML-шаблона.
        3.7) bem - Генерация BEM-классов.
        3.8) getObjectProperties -  Получение списка свойств и методов объекта.
        3.9) setElementData - Установка data-* атрибутов.
        3.10) getElementData - Получение данных из data-* атрибутов с преобразованием типов.
        3.11) isPlainObject - Проверка, является ли объект "простым".
        3.12) isBoolean - Проверка, является ли значение булевым.
        3.13) createElement - Создание DOM-элементов с настройкой свойств и дочерних элементов.

## Архитектура MVP 
Приложение спроектированно по архитектуре MVP
Modal - хранение и работа с данными
View - отображение
Presenter - выступает в роси связующего звена между Modal и View через слушатели events.on и events.emit

## Modal
В данном проекте реализовано три модели данных

1. ProductApi
    Оно отвечает за получение карточек с api и отрпавку заказа
    1. getProdutList() - получение
    2. postOrder() -  отправка
2. ModalBasket
    Хранение и работа с товарами в корзине
    1. protected _basketCount - кол-во товаров в корзине
    2. protected _productsInBasket - массив товаров в корзине
    3. addProductToBasket(item) - добавление товара в корзину
    4. removeProductFromBusket(itemId) - удаление товара из корзины по id
    5. getSumOfProducts() - получение суммы всех товаров в корзине
    6. getCountBasket() - получение кол-ва товаров в корзине 
    7. setCountBasket() - установка кол-ва товаров 
    8. getBasketItems() - получение товаров
    9. clear() - очистка корзины
3. orderModal 
    Хранит в себе данные о заказе:
    1. protected _payment: - способ оплаты
    2. protected _email: - email
    3. protected _phone: -номер телфона ;
    4. protected _address: - адрес;
    5. protected _total: - общая сумма;
    6. protected _items: - id товаров;
    7. getOrderFull() - получение вышеперечисленных товаров в виде объекта

## View
1. BasketView 
    Класс отображения корзины 
    1. protected _basketList : контейнер для карточек
    2. protected _items : Массив карточек 
    3. protected _basketPrice : цена всех товаров
    4. protected _basketTitle : заголовок корзины
    5. protected _basketBrn : кнопка оформить
    6. Сеттеры
2. CardBasket
    Класс отображения карточки товара в корзине
    1. protected _id: id товара
    2. protected _title: заголовок товара
    3. protected _price: цена товара
    4. protected _indexItem : номер товара в корзине
    5. protected _cardBtn : кнопка удаления товара из корзины
    6. сеттеры
3. FormAdressPay
    Класс отображения формы с адрессом и способом оплаты
    1. protected _orderButtons : контейнер с карточками способа оплаты
    2. protected _btnCard : кнопка оплаты по карте;
    3. protected _btnCash : кнопка оплаты по налу;
    4. protected _btnBay : массив карточек в _orderButtons
    5. protected _formInputArdess : инпут ввода адреса;
    6. protected _orderButton : кнопка продолжения оформления заказа;
    7. protected _formErrors : поле отображения ошибок ;
    8. protected _payVar : пременная для сохранения способа оплаты;
    9. protected _ardess : пременная для сохранения адреса;
    10. protected _onSubmit : (data:{_payVar : string, _ardess : string}) => void; - колэбок для presenter чтобы передать _payVar и _ardess
    11. validateFormPayAdress() - валидация адреса и способа оплаты
4. FormForContacts
    класс отображения формы с контактной информацией 
    1. protected _inputArr : массив инпутов
    2. protected _inputEmail : инпут почты;
    3. protected _inputPhone : инпут номера телефона;
    4. protected _payBtn : кнопка оформления заказа;
    5. protected _formErrors : поле ошибок;
    6. protected _email : пременная для сохранения почты;
    7. protected _phone : пременная для сохранения номера телеофна;
    8. protected _onSubmit : (data:{_email : string, _phone : string}) => void; - колэбок для presenter чтобы передать _email и _phone
    9. formatPhoneNumber() - редактирание номера под нужный формат 
    10. validateFormEmailPhone() - валидация почты и номера
5. Success
    класс отображения успешного заказа
    1. protected _orderSuccessDescription : параграф, где отображен текст о спиании ;
    2. protected _orderSuccessClose : кнопка "к след покупкам";
6. Modal 
    класс отображения модального окна
    1. protected _closeBtn : кнопка закрытия
    2. protected _content : div куда вставляются все окна связанные с модыльным;
    3. protected _pageWrap : обретка всей страницы;
    4. open()- ф-я открытия
    5. close() - ф-я закрытия
7. GalleryCardView
    класс отображения карточки в галлерее
    1. protected _image: картинка товара;
    2. protected _category: категория товара;
    3. protected _id: id;
    4. protected _title: заголовок товара;
    5. protected _price: цена товара;
    6. Сеттеры
8. PrevCardView 
    Класс отображения товара в preview 
    1. protected _description: описание товара;
    2. protected _image: картинка товара;
    3. protected _category: категория товара;
    4. protected _id: id;
    5. protected _title: заголовок товара;
    6. protected _price: цена товара;
    7. protected _buttonToBasket : кнопка в корзину;

## Presenter

1. events.on('basketClicked') - клик по корзине 
2. events.on('basketDeleteItem') - удаление товара
3. events.on('createOrder') - создание заказа
4. events.on('openSucsec') - заказ успешен
5. events.on('openFormFirst') - открытие первой формы с адресом 
6. events.on('openSecondForm') - откртие формы с контактами
7. events.on('sendToBasket') - отправить товар в корзину
8. events.on('cardGalaryClicked') - клик по карточке в галлерее 
9. events.on('dataLoaded') - данные с api загруженны


## Возможный сценарий пользователя
1) октрытие карточки товара
2) добавление в корзину или закртие
3) повтор 1 и 2 шага 
4) если добавил хотябы 1 товар, то при откртии корзины в ней будут товары
5) удалить один товар
6) остальные заказть
7) заполенние данных из формы с адресом и способом оплаты
8) заполение контактых данных из соответствующей формы
9) окно успешного заказа