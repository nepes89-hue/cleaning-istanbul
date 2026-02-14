// =============================================
// ЗАГРУЗКА ЦЕН ИЗ assets/prices.json
// =============================================
let SITE_PRICES = null;

async function loadPrices() {
    try {
        console.log('⏳ Загружаем цены...');
        const response = await fetch('/cleaning-istanbul/assets/prices.json?t=' + Date.now());
        if (!response.ok) throw new Error('Файл не найден');
        const data = await response.json();
        SITE_PRICES = data;
        console.log('✅ Цены загружены из prices.json');
        console.log('💰 Кресло стоит:', data['Кресло']?.price);
        
        // Запускаем обновление после загрузки
        updatePricesOnPage();
        
        // Убираем сообщение об ошибке, если оно есть
        const errorElements = document.querySelectorAll('div:not(.success-notification)');
        errorElements.forEach(el => {
            if (el.textContent && el.textContent.includes('Ошибка загрузки цен')) {
                el.style.display = 'none';
            }
        });
        
    } catch (error) {
        console.error('❌ Ошибка загрузки цен:', error);
        // НЕ показываем alert
    }
}

// =============================================
// ОБНОВЛЕНИЕ ЦЕН НА СТРАНИЦЕ
// =============================================
function updatePricesOnPage() {
    if (!SITE_PRICES) {
        console.log('⚠️ Нет цен для обновления');
        return;
    }

    console.log('🔄 Обновляем цены на странице...');
    
    const prices = SITE_PRICES;
    
    // Ищем все строки с ценами
    const rows = document.querySelectorAll('tr, .service-row, [class*="service"]');
    
    rows.forEach(row => {
        const text = row.textContent || '';
        
        // Кресло
        if (text.includes('Кресло')) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                cells[2].innerHTML = prices['Кресло'].price + ' - ' + (prices['Кресло'].priceMax || prices['Кресло'].price + 300) + ' TL';
                console.log('✅ Кресло обновлено');
            }
        }
        
        // Диван
        if (text.includes('Диван')) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                cells[2].innerHTML = prices['Диван (2-местный)'].price + ' - ' + (prices['Диван (2-местный)'].priceMax || prices['Диван (2-местный)'].price + 300) + ' TL';
                console.log('✅ Диван обновлён');
            }
        }
        
        // Матрас
        if (text.includes('Матрас')) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                cells[2].innerHTML = prices['Матрас'].price + ' - ' + (prices['Матрас'].priceMax || prices['Матрас'].price + 300) + ' TL';
            }
        }
        
        // Ковёр
        if (text.includes('Ковёр')) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                cells[2].innerHTML = prices['Ковёр'].price + ' - ' + (prices['Ковёр'].priceMax || prices['Ковёр'].price + 300) + ' TL/м²';
            }
        }
        
        // Автомобиль
        if (text.includes('Авто') || text.includes('Автомобиль')) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                cells[2].innerHTML = prices['Автомобиль (легковой)'].price + ' - ' + (prices['Автомобиль (легковой)'].priceMax || prices['Автомобиль (легковой)'].price + 300) + ' TL';
            }
        }
    });
    
    // Обновляем калькулятор
    if (typeof calculatePrice === 'function') {
        calculatePrice();
    }
    
    console.log('✅ Обновление цен завершено');
}

// =============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================================
function getCurrentLanguage() {
    const activeBtn = document.querySelector('.lang-btn.active');
    return activeBtn ? activeBtn.textContent : 'ru';
}

function normalizePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('90')) return digits;
    if (digits.startsWith('0')) return '9' + digits.substring(1);
    if (digits.length === 10) return '90' + digits;
    return digits;
}

// =============================================
// РЕГИСТРАЦИЯ
// =============================================
async function registerForPrices() {
    const name = document.getElementById('regName')?.value?.trim();
    const phone = document.getElementById('regPhone')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    
    if (!name || !phone) {
        alert('❌ Пожалуйста, заполните имя и телефон');
        return false;
    }
    
    const turkishPhone = normalizePhone(phone);
    const discount = Math.floor(Math.random() * 11);
    const language = getCurrentLanguage();
    
    localStorage.setItem('cleaningUser', JSON.stringify({
        name: name,
        phone: turkishPhone,
        email: email,
        registeredAt: new Date().toISOString(),
        discount: discount,
        language: language
    }));
    
    localStorage.setItem('hasPriceAccess', 'true');
    localStorage.setItem('userDiscount', discount);
    
    const messages = {
        'ru': { title: 'Регистрация успешна!', message: `Спасибо, ${name}! Вы успешно зарегистрированы.` },
        'en': { title: 'Registration Successful!', message: `Thank you, ${name}! You have successfully registered.` },
        'tr': { title: 'Kayıt Başarılı!', message: `Teşekkürler, ${name}! Başarıyla kayıt oldunuz.` }
    };
    
    const lang = language.toLowerCase().includes('ru') ? 'ru' : 
                language.toLowerCase().includes('en') ? 'en' : 'tr';
    
    alert(messages[lang].title + ' ' + messages[lang].message + ' Ваша скидка: ' + discount + '%');
    
    setTimeout(() => {
        const priceReg = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        if (priceReg) priceReg.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
    }, 500);
    
    return false;
}

// =============================================
// ЗАЯВКА
// =============================================
async function submitOrderForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name')?.value;
    const phone = document.getElementById('phone')?.value;
    const district = document.getElementById('district')?.value;
    const service = document.getElementById('service')?.value;
    const message = document.getElementById('message')?.value;
    const language = getCurrentLanguage();
    
    const orderMessages = {
        'ru': { title: 'Заявка отправлена!', message: `Спасибо, ${name}! Мы свяжемся с вами в течение 30 минут.` },
        'en': { title: 'Request Sent!', message: `Thank you, ${name}! We'll contact you within 30 minutes.` },
        'tr': { title: 'Talep Gönderildi!', message: `Teşekkürler, ${name}! 30 dakika içinde sizinle iletişime geçeceğiz.` }
    };
    
    const lang = language.toLowerCase().includes('ru') ? 'ru' : 
                language.toLowerCase().includes('en') ? 'en' : 'tr';
    
    alert(orderMessages[lang].title + ' ' + orderMessages[lang].message);
    
    e.target.reset();
    return false;
}

// =============================================
// ПОКАЗАТЬ ЦЕНЫ ПО ПАРОЛЮ
// =============================================
function showPrices() {
    const password = document.getElementById('pricePassword')?.value;
    const correctPassword = 'clean123';
    
    if (password === correctPassword) {
        const priceReg = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        if (priceReg) priceReg.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
        localStorage.setItem('hasPriceAccess', 'true');
    } else {
        alert('❌ Неверный пароль! Зарегистрируйтесь для получения доступа.');
    }
}

// =============================================
// КАЛЬКУЛЯТОР
// =============================================
function calculatePrice() {
    const service = document.getElementById('calcService')?.value;
    const size = parseFloat(document.getElementById('calcSize')?.value) || 0;
    
    if (!SITE_PRICES) {
        setTimeout(calculatePrice, 500);
        return;
    }
    
    const prices = SITE_PRICES;
    
    const serviceMap = {
        'sofa': 'Диван',
        'armchair': 'Кресло',
        'mattress': 'Матрас',
        'carpet': 'Ковёр',
        'car': 'Автомобиль',
        'curtain': 'Шторы',
        'chair': 'Стул'
    };
    
    const serviceNamePattern = serviceMap[service];
    let priceData = null;
    let serviceName = '';
    
    for (let [name, data] of Object.entries(prices)) {
        if (name.includes(serviceNamePattern) || serviceNamePattern.includes(name)) {
            priceData = data;
            serviceName = name;
            break;
        }
    }
    
    let price = 0;
    if (priceData) {
        price = (service === 'carpet') ? priceData.price * size : priceData.price;
    }
    
    const discount = parseInt(localStorage.getItem('userDiscount')) || 0;
    const discountAmount = price * discount / 100;
    const finalPrice = price - discountAmount;
    
    const resultElement = document.getElementById('calcResult');
    if (resultElement && price > 0) {
        let html = `<h4>${serviceName}</h4>`;
        if (discount > 0) {
            html += `
                <p>Обычная цена: <s>${price} TL</s></p>
                <p>Ваша скидка: <strong style="color: #2ecc71;">${discount}% (${discountAmount.toFixed(0)} TL)</strong></p>
                <p style="font-size: 1.5rem; color: #e74c3c;">Итоговая цена: <strong>${finalPrice.toFixed(0)} TL</strong></p>
            `;
        } else {
            html += `<p>Цена: <strong style="font-size: 1.5rem; color: #e74c3c;">${price} TL</strong></p>`;
        }
        if (service === 'carpet') {
            html += `<small>Площадь: ${size} м² × ${priceData?.price || 180} TL/м²</small>`;
        }
        resultElement.innerHTML = html;
        
        const orderBtn = document.getElementById('calcOrderBtn');
        if (orderBtn) {
            orderBtn.style.display = 'block';
            orderBtn.href = `#order?service=${service}&price=${finalPrice.toFixed(0)}&discount=${discount}`;
        }
    } else if (resultElement) {
        resultElement.innerHTML = 'Выберите услугу для расчёта стоимости';
    }
}

// =============================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Сайт загружен, запускаем обновление цен...');
    loadPrices();
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Калькулятор
    const calcService = document.getElementById('calcService');
    const sizeContainer = document.getElementById('sizeContainer');
    
    if (calcService && sizeContainer) {
        calcService.addEventListener('change', function() {
            sizeContainer.style.display = this.value === 'carpet' ? 'block' : 'none';
            calculatePrice();
        });
        
        const calcSize = document.getElementById('calcSize');
        if (calcSize) {
            calcSize.addEventListener('input', calculatePrice);
        }
    }
    
    // Проверка доступа к ценам
    if (localStorage.getItem('hasPriceAccess') === 'true') {
        const priceReg = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        if (priceReg) priceReg.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
    }
});

// =============================================
// ЭКСПОРТ БАЗЫ ДАННЫХ
// =============================================
function exportDatabase() {
    const db = JSON.parse(localStorage.getItem('cleaningDatabase') || '{"registrations":[], "orders":[]}');
    const dataStr = JSON.stringify(db, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanpro-clients-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ База клиентов экспортирована\nРегистраций: ${db.registrations.length}\nЗаявок: ${db.orders.length}`);
}
