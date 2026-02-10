// =============================================
// ОСНОВНЫЕ ФУНКЦИИ ДЛЯ WHATSAPP УВЕДОМЛЕНИЙ
// =============================================

// ВАШ НОМЕР WHATSAPP (ИЗМЕНИТЕ НА СВОЙ!)
const YOUR_WHATSAPP_NUMBER = '905550644089';

// Вспомогательные функции
function normalizePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('90')) return digits;
    if (digits.startsWith('0')) return '9' + digits.substring(1);
    if (digits.length === 10) return '90' + digits;
    return digits;
}

function getCurrentLanguage() {
    const activeBtn = document.querySelector('.lang-btn.active');
    return activeBtn ? activeBtn.textContent : 'ru';
}

function showDiscountNotification(discount) {
    const notification = `
        <div class="discount-notification" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        ">
            <h4 style="margin: 0 0 10px 0;">🎉 Вам предоставлена скидка!</h4>
            <p style="margin: 0; font-size: 1.5rem; font-weight: bold;">${discount}% на все услуги</p>
            <p style="margin: 10px 0 0 0; font-size: 0.9rem;">Скидка автоматически применяется при заказе</p>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
            ">×</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', notification);
    setTimeout(() => {
        const el = document.querySelector('.discount-notification');
        if (el) el.remove();
    }, 10000);
}

// Локальная база данных
function saveToLocalDatabase(data) {
    const db = JSON.parse(localStorage.getItem('cleaningDatabase') || '{"registrations":[], "orders":[]}');
    
    if (data.type === 'registration') {
        db.registrations.push(data);
    } else if (data.type === 'order') {
        db.orders.push(data);
    }
    
    localStorage.setItem('cleaningDatabase', JSON.stringify(db));
    
    // Статистика в консоль
    console.log('📊 База обновлена:', {
        регистраций: db.registrations.length,
        заявок: db.orders.length
    });
}

// =============================================
// РЕГИСТРАЦИЯ С УВЕДОМЛЕНИЕМ В WHATSAPP
// =============================================

async function registerForPrices() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
    }
    
    const turkishPhone = normalizePhone(phone);
    const discount = Math.floor(Math.random() * 11);
    
    // Сообщение для вас (администратора)
    const messageToYou = `📝 НОВАЯ РЕГИСТРАЦИЯ:

👤 Имя: ${name}
📱 Телефон: ${turkishPhone}
📧 Email: ${email || 'не указан'}
🌐 Язык: ${getCurrentLanguage()}
⏰ Время: ${new Date().toLocaleString()}
🔗 Источник: сайт CleanPro Istanbul`;
    
    // Сообщение для клиента
    const messageToClient = `Добрый день, ${name}! Спасибо за регистрацию на сайте CleanPro Istanbul.

✅ Вы успешно зарегистрированы!
🎉 Ваша персональная скидка: ${discount}% на все услуги

📞 Наш телефон: +90 555 064 40 89
📍 Обслуживаем весь Стамбул

С уважением,
CleanPro Istanbul Team`;
    
    // 1. Сохраняем данные клиента
    localStorage.setItem('cleaningUser', JSON.stringify({
        name: name,
        phone: turkishPhone,
        email: email,
        registeredAt: new Date().toISOString(),
        discount: discount,
        language: getCurrentLanguage()
    }));
    
    localStorage.setItem('hasPriceAccess', 'true');
    localStorage.setItem('userDiscount', discount);
    
    // 2. Отправляем вам уведомление в WhatsApp
    const encodedMessage = encodeURIComponent(messageToYou);
    window.open(`https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    
    // 3. Показываем цены клиенту
    document.getElementById('priceRegistration').style.display = 'none';
    document.getElementById('actualPrices').style.display = 'block';
    showDiscountNotification(discount);
    
    // 4. Предлагаем клиенту сохранить ваш номер
    setTimeout(() => {
        if (confirm(`✅ Регистрация успешна! Ваша скидка: ${discount}%

Хотите сохранить наш номер WhatsApp для быстрой связи?`)) {
            const clientMessage = encodeURIComponent(messageToClient);
            window.open(`https://wa.me/905550644089?text=${clientMessage}`, '_blank');
        }
    }, 1000);
    
    // 5. Сохраняем в базу
    saveToLocalDatabase({
        type: 'registration',
        name: name,
        phone: turkishPhone,
        email: email,
        discount: discount,
        timestamp: new Date().toISOString()
    });
}

// =============================================
// ОТПРАВКА ЗАЯВКИ С УВЕДОМЛЕНИЕМ В WHATSAPP
// =============================================

async function submitOrderForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const district = document.getElementById('district').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;
    
    // Сообщение для вас (администратора)
    const messageToYou = `🚀 НОВАЯ ЗАЯВКА:

👤 Имя: ${name}
📱 Телефон: ${phone}
📍 Район: ${district}
🛠 Услуга: ${service}
📝 Комментарий: ${message || 'нет'}
🌐 Язык: ${getCurrentLanguage()}
⏰ Время: ${new Date().toLocaleString()}
🔗 Источник: сайт CleanPro Istanbul

💡 НЕЗАМЕДЛИТЕЛЬНО СВЯЗАТЬСЯ!`;
    
    // Сообщение для клиента
    const userData = JSON.parse(localStorage.getItem('cleaningUser') || '{}');
    const discount = userData.discount || 0;
    
    const messageToClient = `Добрый день, ${name}! Спасибо за заявку на сайте CleanPro Istanbul.

✅ Ваша заявка получена:
• Услуга: ${service}
• Район: ${district}
• Комментарий: ${message || 'не указано'}

${discount > 0 ? `🎉 Ваша скидка: ${discount}% (уже учтена в стоимости)` : ''}

📞 Мы свяжемся с вами в течение 30 минут по номеру: ${phone}

С уважением,
CleanPro Istanbul Team
+90 555 064 40 89`;
    
    // 1. Отправляем вам уведомление
    const encodedMessage = encodeURIComponent(messageToYou);
    window.open(`https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    
    // 2. Показываем сообщение клиенту
    alert('✅ Заявка отправлена! Открывается WhatsApp для подтверждения.');
    
    // 3. Отправляем подтверждение клиенту
    setTimeout(() => {
        const clientMessage = encodeURIComponent(messageToClient);
        window.open(`https://wa.me/905550644089?text=${clientMessage}`, '_blank');
    }, 2000);
    
    // 4. Сохраняем заявку
    saveToLocalDatabase({
        type: 'order',
        name: name,
        phone: phone,
        district: district,
        service: service,
        message: message,
        timestamp: new Date().toISOString()
    });
    
    // 5. Сбрасываем форму
    e.target.reset();
    
    return false;
}

// =============================================
// КАЛЬКУЛЯТОР С УЧЁТОМ СКИДКИ
// =============================================

function calculatePrice() {
    const service = document.getElementById('calcService').value;
    const size = parseFloat(document.getElementById('calcSize').value) || 0;
    let price = 0;
    let serviceName = '';
    
    const prices = {
        'sofa': 600,
        'armchair': 350,
        'mattress': 450,
        'carpet': 180,
        'car': 1200,
        'curtain': 250,
        'chair': 150
    };
    
    switch(service) {
        case 'sofa':
            price = prices.sofa;
            serviceName = 'Диван (2-местный)';
            break;
        case 'armchair':
            price = prices.armchair;
            serviceName = 'Кресло';
            break;
        case 'mattress':
            price = prices.mattress;
            serviceName = 'Матрас';
            break;
        case 'carpet':
            price = prices.carpet * size;
            serviceName = 'Ковёр';
            break;
        case 'car':
            price = prices.car;
            serviceName = 'Автомобиль (легковой)';
            break;
        case 'curtain':
            price = prices.curtain;
            serviceName = 'Шторы';
            break;
        case 'chair':
            price = prices.chair;
            serviceName = 'Стул';
            break;
        default:
            price = 0;
    }
    
    // Применяем скидку
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
            html += `<small>Площадь: ${size} м² × 180 TL/м²</small>`;
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
// ОБРАБОТКА ФОРМ И СКРЫТЫЕ ФУНКЦИИ
// =============================================

// Показать цены по паролю
function showPrices() {
    const password = document.getElementById('pricePassword').value;
    const correctPassword = 'clean123';
    
    if (password === correctPassword) {
        document.getElementById('priceProtection').style.display = 'none';
        document.getElementById('priceContent').style.display = 'block';
        localStorage.setItem('hasPriceAccess', 'true');
    } else {
        alert('Неверный пароль! Для получения пароля зарегистрируйтесь или свяжитесь с нами.');
    }
}

// Плавная прокрутка
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Автоматическое управление полем размера ковра
    const calcService = document.getElementById('calcService');
    const sizeContainer = document.getElementById('sizeContainer');
    
    if (calcService && sizeContainer) {
        calcService.addEventListener('change', function() {
            if (this.value === 'carpet') {
                sizeContainer.style.display = 'block';
            } else {
                sizeContainer.style.display = 'none';
            }
            calculatePrice();
        });
        
        const calcSize = document.getElementById('calcSize');
        if (calcSize) {
            calcSize.addEventListener('input', calculatePrice);
        }
    }
    
    // Проверяем регистрацию при загрузке
    if (localStorage.getItem('hasPriceAccess') === 'true') {
        const priceProtection = document.getElementById('priceProtection');
        const priceContent = document.getElementById('priceContent');
        const priceRegistration = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        
        if (priceProtection) priceProtection.style.display = 'none';
        if (priceContent) priceContent.style.display = 'block';
        if (priceRegistration) priceRegistration.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
    }
});

// Экспорт базы данных
function exportDatabase() {
    const db = JSON.parse(localStorage.getItem('cleaningDatabase') || '{"registrations":[], "orders":[]}');
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanpro-database-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`База данных экспортирована!
Регистраций: ${db.registrations.length}
Заявок: ${db.orders.length}`);
}

// =============================================
// АДМИН-ПАНЕЛЬ (скрытая, активируется тройным кликом)
// =============================================

let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BODY') {
        clickCount++;
        setTimeout(() => { clickCount = 0; }, 1000);
        
        if (clickCount === 3) {
            document.getElementById('adminPanel').style.display = 'block';
            alert('🔧 Админ-панель активирована!');
            clickCount = 0;
        }
    }
});

function toggleAdminPanel() {
    const menu = document.getElementById('adminMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    updateStats();
}

function updateStats() {
    const db = JSON.parse(localStorage.getItem('cleaningDatabase') || '{"registrations":[], "orders":[]}');
    const statsReg = document.getElementById('statsReg');
    const statsOrders = document.getElementById('statsOrders');
    
    if (statsReg) statsReg.textContent = db.registrations.length;
    if (statsOrders) statsOrders.textContent = db.orders.length;
}

function clearDatabase() {
    if (confirm('Очистить всю базу данных?')) {
        localStorage.removeItem('cleaningDatabase');
        localStorage.removeItem('cleaningUser');
        localStorage.removeItem('hasPriceAccess');
        localStorage.removeItem('userDiscount');
        updateStats();
        alert('База данных очищена');
    }
}

function testWhatsApp() {
    const testMessage = encodeURIComponent('✅ Тестовое сообщение от сайта CleanPro Istanbul\n\nВремя: ' + new Date().toLocaleString());
    window.open(`https://wa.me/905550644089?text=${testMessage}`, '_blank');
}

// Обновлять статистику каждые 10 секунд
setInterval(updateStats, 10000);
