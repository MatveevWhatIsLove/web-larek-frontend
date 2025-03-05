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


Функции, которые данны изначально:
    1) Файл events
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



    2)Файл Components

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

    3) utils

        3.1) Преобразует строку из формата PascalCase (например, SomeText) в kebab-case (например, some-text).
            export function pascalToKebab(value: string): string {
                return value.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
            }
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