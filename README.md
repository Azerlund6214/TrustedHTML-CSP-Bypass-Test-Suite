# TrustedHTML-CSP-Bypass-Test-Suite

> Набор тестов для проверки методов обхода ограничения TrustedHTML в условиях строгой Content Security Policy (CSP) браузеров.

## ?? Назначение

Этот инструмент проверяет различные подходы к созданию HTML-элементов и вставке их на страницу, обходя ограничение **`TrustedHTML`**, введённое современными браузерами (Chrome 95+) в рамках политики безопасности контента (CSP).

**Проблема:** Современные браузеры блокируют прямое присвоение HTML через `innerHTML` и подобные свойства, требуя использования доверенного типа `TrustedHTML`, что ломает многие пользовательские скрипты и расширения.

## ?? Тестируемые методы

Тестер проверяет 6 различных подходов:

| Метод | Описание | Когда использовать |
|-------|----------|-------------------|
| **1. createElement + appendChild** | Создание элементов через DOM API | Всегда безопасно, рекомендуется |
| **2. insertAdjacentHTML** | Вставка HTML рядом с элементом | Когда нужно вставить готовый HTML |
| **3. outerHTML** | Замена элемента целиком | Для быстрой замены существующих элементов |
| **4. document.write (iframe)** | Через изолированный iframe | Для изолированного контекста |
| **5. DOMParser** | Парсинг строки в DOM-документ | Для сложных HTML-структур |
| **6. Текстовые узлы** | Через createTextNode + createElement | Максимально безопасный подход |

## ?? Быстрый старт

1. **Откройте консоль разработчика** на любой странице:
   - `F12` или `Ctrl+Shift+I`
   - Вкладка **Console**

2. **Вставьте и выполните код тестера:**
   ```javascript
   // Запуск полного теста
   const results = testInnerHTMLBypass();
   ```

3. **Или проверьте конкретный метод:**
   ```javascript
   // Тест конкретного метода (1-6)
   quickTest(1); // Метод createElement
   quickTest(5); // Метод DOMParser
   ```

## ?? Результаты тестирования

После запуска тестер выводит:
- ? **Успешные методы** — работают в текущем контексте CSP
- ? **Заблокированные методы** — не работают из-за политик безопасности
- ?? **Статистику** — сколько методов работает из всех тестируемых

## ??? Использование в разработке

### Для тестирования CSP конкретного сайта
```javascript
// 1. Откройте сайт в браузере
// 2. Вставьте тестер в консоль
testInnerHTMLBypass();

// 3. Проверьте, какие методы проходят
// 4. Используйте работающие методы в своём коде
```

### Для интеграции в свой проект
```javascript
// Вставьте в свой скрипт функцию создания элементов
function safeCreateElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Атрибуты
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on')) {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Дети
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Использование
const button = safeCreateElement('button', 
    { 
        id: 'my-btn',
        style: { color: 'white', background: 'blue' },
        onclick: () => alert('Clicked!')
    },
    ['Нажми меня']
);

document.body.appendChild(button);
```

## ?? Технические детали

### Почему возникает ошибка TrustedHTML?
Браузеры внедрили Trusted Types API для защиты от XSS-атак. Когда сайт использует строгую CSP с директивой `require-trusted-types-for 'script'`, браузер блокирует:
- `innerHTML`
- `outerHTML`
- `insertAdjacentHTML`
- `document.write`

### Как тестер определяет работоспособность?
1. Создаёт тестовые элементы в изолированном контексте
2. Пытается использовать каждый метод
3. Проверяет, не вызвало ли это ошибок
4. Удаляет тестовые элементы после проверки

## ?? Пример вывода
```
?? Тестируем способы обхода CSP для innerHTML...
==================================================
1. createElement + appendChild: ? Успех
2. insertAdjacentHTML: ? Ошибка: Failed to set the 'innerHTML' property...
3. outerHTML: ? Ошибка: Failed to set the 'outerHTML' property...
4. document.write (iframe): ? Успех
5. DOMParser: ? Успех
6. Текстовые узлы + createElement: ? Успех
==================================================
?? Работающих методов: 4 из 6
?? Рекомендация: Используйте методы с пометкой "? Успех"
Лучшие варианты для UI:
1. createElement + appendChild (безопасно, всегда работает)
2. DOMParser + appendChild (гибко для сложного HTML)
```

## ?? Ограничения

- **Только браузер:** Работает только в среде браузера
- **Зависит от CSP:** Результаты зависят от политик безопасности тестируемого сайта
- **Нет гарантий:** Методы, работающие сегодня, могут быть заблокированы в будущих версиях браузеров

## ?? Вклад в развитие

1. Форкните репозиторий
2. Добавьте новые методы тестирования
3. Отправьте Pull Request

## ?? Лицензия

MIT License — свободное использование, модификация и распространение.

---

## ?? Ссылки по теме

- [Trusted Types на MDN](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/)
- [Google Developers: Trusted Types](https://web.dev/trusted-types/)

---

**Версия:** v1.0  
**Статус:** Рабочий  
**Последнее обновление:** dec.2025
