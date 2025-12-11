// Тестер обхода CSP для innerHTML в консоли
function testInnerHTMLBypass() {
    console.log('🔍 Тестируем способы обхода CSP для innerHTML...');
    console.log('='.repeat(50));
    
    const testResults = [];
    
    // Способ 1: Создание элементов через createElement и appendChild
    function testMethod1() {
        try {
            const testDiv = document.createElement('div');
            testDiv.id = 'test-method-1';
            
            const span = document.createElement('span');
            span.textContent = 'Тест метод 1';
            testDiv.appendChild(span);
            
            document.body.appendChild(testDiv);
            
            const exists = document.getElementById('test-method-1');
            testDiv.remove();
            
            return exists ? '✅ Успех' : '❌ Не удалось';
        } catch (e) {
            return `❌ Ошибка: ${e.message}`;
        }
    }
    
    // Способ 2: Использование insertAdjacentHTML (может обходить некоторые CSP)
    function testMethod2() {
        try {
            const testDiv = document.createElement('div');
            testDiv.id = 'test-method-2';
            document.body.appendChild(testDiv);
            
            testDiv.insertAdjacentHTML('beforeend', '<span>Тест метод 2</span>');
            
            const hasContent = testDiv.innerHTML.includes('Тест');
            testDiv.remove();
            
            return hasContent ? '✅ Успех' : '❌ Не удалось';
        } catch (e) {
            return `❌ Ошибка: ${e.message}`;
        }
    }
    
    // Способ 3: Использование outerHTML
    function testMethod3() {
        try {
            const testDiv = document.createElement('div');
            testDiv.id = 'test-method-3';
            document.body.appendChild(testDiv);
            
            testDiv.outerHTML = '<div id="test-method-3"><span>Тест метод 3</span></div>';
            
            const exists = document.getElementById('test-method-3');
            if (exists) exists.remove();
            
            return exists ? '✅ Успех' : '❌ Не удалось';
        } catch (e) {
            return `❌ Ошибка: ${e.message}`;
        }
    }
    
    // Способ 4: Использование document.write (работает только при загрузке)
    function testMethod4() {
        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            let result = '❌ Не удалось';
            
            if (iframe.contentWindow) {
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write('<span>Тест метод 4</span>');
                iframe.contentWindow.document.close();
                
                const hasContent = iframe.contentWindow.document.body.innerHTML.includes('Тест');
                result = hasContent ? '✅ Успех' : '❌ Не удалось';
            }
            
            iframe.remove();
            return result;
        } catch (e) {
            return `❌ Ошибка: ${e.message}`;
        }
    }
    
    // Способ 5: Использование DOMParser
    function testMethod5() {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString('<div id="test-method-5"><span>Тест метод 5</span></div>', 'text/html');
            
            const element = doc.getElementById('test-method-5');
            if (element) {
                document.body.appendChild(element);
                element.remove();
                return '✅ Успех';
            }
            return '❌ Не удалось';
        } catch (e) {
            return `❌ Ошибка: ${e.message}`;
        }
    }
    
    // Способ 6: Использование текстового содержимого + createElement
    function testMethod6() {
        try {
            const testDiv = document.createElement('div');
            testDiv.id = 'test-method-6';
            
            // Построение через текстовые узлы и createElement
            const textNode = document.createTextNode('Тест метод 6 ');
            testDiv.appendChild(textNode);
            
            const strong = document.createElement('strong');
            strong.textContent = 'работает!';
            testDiv.appendChild(strong);
            
            document.body.appendChild(testDiv);
            const exists = document.getElementById('test-method-6');
            testDiv.remove();
            
            return exists ? '✅ Успех' : '❌ Не удалось';
        } catch (e) {
            return `❌ Ошибка: ${e.message}`;
        }
    }
    
    // Запускаем все тесты
    testResults.push({ method: '1. createElement + appendChild', result: testMethod1() });
    testResults.push({ method: '2. insertAdjacentHTML', result: testMethod2() });
    testResults.push({ method: '3. outerHTML', result: testMethod3() });
    testResults.push({ method: '4. document.write (iframe)', result: testMethod4() });
    testResults.push({ method: '5. DOMParser', result: testMethod5() });
    testResults.push({ method: '6. Текстовые узлы + createElement', result: testMethod6() });
    
    // Выводим результаты
    testResults.forEach(test => {
        console.log(`${test.method}: ${test.result}`);
    });
    
    console.log('='.repeat(50));
    
    // Рекомендация
    const workingMethods = testResults.filter(t => t.result.startsWith('✅')).length;
    console.log(`📊 Работающих методов: ${workingMethods} из ${testResults.length}`);
    
    if (workingMethods > 0) {
        console.log('💡 Рекомендация: Используйте методы с пометкой "✅ Успех"');
        console.log('Лучшие варианты для UI:');
        console.log('1. createElement + appendChild (безопасно, всегда работает)');
        console.log('2. DOMParser + appendChild (гибко для сложного HTML)');
    } else {
        console.log('⚠️ Все методы заблокированы. Возможно, нужен другой подход.');
    }
    
    return testResults;
}

// Запуск тестера
const results = testInnerHTMLBypass();

// Функция для быстрой проверки конкретного метода
function quickTest(methodNumber = 1) {
    console.log(`Быстрый тест метода ${methodNumber}...`);
    
    switch(methodNumber) {
        case 1:
            // Метод 1: createElement
            const div1 = document.createElement('div');
            div1.id = 'quick-test-1';
            div1.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;z-index:9999';
            
            const h1 = document.createElement('h3');
            h1.textContent = 'Тест метод 1';
            div1.appendChild(h1);
            
            const p1 = document.createElement('p');
            p1.textContent = 'Если видите этот красный блок - метод работает';
            div1.appendChild(p1);
            
            document.body.appendChild(div1);
            console.log('Метод 1: Блок создан. Если видите красный блок - успех.');
            break;
            
        case 5:
            // Метод 5: DOMParser
            const parser = new DOMParser();
            const html = `
                <div id="quick-test-5" style="position:fixed;top:10px;right:10px;background:blue;color:white;padding:10px;z-index:9999">
                    <h3>Тест метод 5</h3>
                    <p>DOMParser работает!</p>
                </div>
            `;
            const doc = parser.parseFromString(html, 'text/html');
            const element = doc.body.firstChild;
            if (element) {
                document.body.appendChild(element);
                console.log('Метод 5: Блок создан через DOMParser.');
            }
            break;
            
        default:
            console.log('Метод не найден. Используйте 1 или 5.');
    }
}

// Для быстрого тестирования в консоли:
// quickTest(1) - тест метода createElement
// quickTest(5) - тест метода DOMParser