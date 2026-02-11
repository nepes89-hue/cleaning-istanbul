// =============================================
// ОСНОВНЫЕ НАСТРОЙКИ
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

// =============================================
// ОТПРАВКА ВАМ УВЕДОМЛЕНИЯ В WHATSAPP (СКРЫТО)
// =============================================

function sendWhatsAppNotification(message) {
    // СОЗДАЁМ СКРЫТЫЙ IFRAME - НИЧЕГО НЕ ОТКРЫВАЕТСЯ У КЛИЕНТА!
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // Скрываем
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    
    const encodedMessage = encodeURIComponent(message);
    iframe.src = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    document.body.appendChild(iframe);
    
    // Удаляем через 2 секунды
    setTimeout(() => {
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 2000);
}

// =============================================
// КРАСИВЫЕ УВЕДОМЛЕНИЯ ДЛЯ КЛИЕНТА (НА САЙТЕ)
// =============================================

function showSuccessNotification(title, message, discount = 0) {
    const notification = `
        <div class="success-notification" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 99999;
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: fadeIn 0.3s ease;
        ">
            <div style="font-size: 3rem; margin-bottom: 15px; color: #2ecc71;">
                ✅
            </div>
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${title}</h3>
            <p style="margin: 0 0 15px 0; color: #666; line-height: 1.5;">${message}</p>
            
            ${discount > 0 ? `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <h4 style="margin: 0 0 5px 0; color: #e74c3c;">🎉 Ваша скидка!</h4>
                    <p style="margin: 0; font-size: 1.8rem; font-weight: bold; color: #e74c3c;">
                        ${discount}% на все услуги
                    </p>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="closeNotification()" style="
                    flex: 1;
                    padding: 12px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    Продолжить
                </button>
                <button onclick="saveToContacts()" style="
                    flex: 1;
                    padding: 12px;
                    background: #2ecc71;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    📞 Сохранить контакт
                </button>
            </div>
            
            <button onclick="closeNotification()" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
            ">×</button>
        </div>
        <div class="notification-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
            animation: fadeIn 0.3s ease;
        "></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', notification);
}

function closeNotification() {
    const notifications = document.querySelectorAll('.success-notification, .notification-overlay');
    notifications.forEach(el => el.remove());
}

function saveToContacts() {
    const phone = '+90 555 064 40 89';
    const message = encodeURIComponent('Здравствуйте! Хочу получить консультацию по услугам химчистки.');
    
    // Открываем WhatsApp ТОЛЬКО если клиент сам нажал кнопку
    window.open(`https://wa.me/905550644089?text=${message}`, '_blank');
    closeNotification();
}

// Стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// =============================================
// РЕГИСТРАЦИЯ (КЛИЕНТУ - УВЕДОМЛЕНИЕ, ВАМ - WHATSAPP В ФОНЕ)
// =============================================

async function registerForPrices() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return false;
    }
    
    const turkishPhone = normalizePhone(phone);
    const discount = Math.floor(Math.random() * 11);
    const language = getCurrentLanguage();
    
    // =============================================
    // 1. СООБЩЕНИЕ ДЛЯ ВАС (WHATSAPP В ФОНЕ - НИЧЕГО НЕ ОТКРЫВАЕТСЯ!)
    // =============================================
    const messageToYou = `📝 НОВАЯ РЕГИСТРАЦИЯ:

👤 Имя: ${name}
📱 Телефон: ${turkishPhone}
📧 Email: ${email || 'не указан'}
🌐 Язык: ${language}
🎉 Скидка: ${discount}%
⏰ Время: ${new Date().toLocaleString()}
🔗 Источник: сайт CleanPro Istanbul

💡 КЛИЕНТ ЗАРЕГИСТРИРОВАЛСЯ!`;
    
    // ОТПРАВЛЯЕМ В ФОНЕ - У КЛИЕНТА НИЧЕГО НЕ ОТКРЫВАЕТСЯ!
    sendWhatsAppNotification(messageToYou);
    
    // =============================================
    // 2. СОХРАНЯЕМ ДАННЫЕ КЛИЕНТА
    // =============================================
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
    
    // =============================================
    // 3. ПОКАЗЫВАЕМ КРАСИВОЕ УВЕДОМЛЕНИЕ КЛИЕНТУ (ТОЛЬКО НА САЙТЕ!)
    // =============================================
    
    // Тексты на разных языках
    const messages = {
        'ru': {
            title: 'Регистрация успешна!',
            message: `Спасибо, ${name}! Вы успешно зарегистрированы в системе CleanPro Istanbul. Теперь вам доступны все цены и специальные предложения.`,
            discount: discount
        },
        'en': {
            title: 'Registration Successful!',
            message: `Thank you, ${name}! You have successfully registered with CleanPro Istanbul. You now have access to all prices and special offers.`,
            discount: discount
        },
        'tr': {
            title: 'Kayıt Başarılı!',
            message: `Teşekkürler, ${name}! CleanPro Istanbul sistemine başarıyla kayıt oldunuz. Artık tüm fiyatlar ve özel teklifler size açık.`,
            discount: discount
        }
    };
    
    const lang = language.toLowerCase().includes('ru') ? 'ru' : 
                language.toLowerCase().includes('en') ? 'en' : 'tr';
    
    const msg = messages[lang];
    
    // ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ КЛИЕНТУ (НЕ ОТКРЫВАЕМ WHATSAPP!)
    showSuccessNotification(msg.title, msg.message, msg.discount);
    
    // Показываем цены
    setTimeout(() => {
        const priceReg = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        
        if (priceReg) priceReg.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
    }, 500);
    
    // =============================================
    // 4. СОХРАНЯЕМ В БАЗУ ДАННЫХ
    // =============================================
    saveToLocalDatabase({
        type: 'registration',
        name: name,
        phone: turkishPhone,
        email: email,
        discount: discount,
        language: language,
        timestamp: new Date().toISOString()
    });
    
    return false; // Предотвращаем перезагрузку страницы
}

// =============================================
// ОТПРАВКА ЗАЯВКИ (КЛИЕНТУ - УВЕДОМЛЕНИЕ, ВАМ - WHATSAPP В ФОНЕ)
// =============================================

async function submitOrderForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const district = document.getElementById('district').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;
    const language = getCurrentLanguage();
    
    // =============================================
    // 1. СООБЩЕНИЕ ДЛЯ ВАС (WHATSAPP В ФОНЕ - НИЧЕГО НЕ ОТКРЫВАЕТСЯ!)
    // =============================================
    const messageToYou = `🚀 НОВАЯ ЗАЯВКА:

👤 Имя: ${name}
📱 Телефон: ${phone}
📍 Район: ${district}
🛠 Услуга: ${service}
📝 Комментарий: ${message || 'нет'}
🌐 Язык: ${language}
⏰ Время: ${new Date().toLocaleString()}
🔗 Источник: сайт CleanPro Istanbul

💡 НЕЗАМЕДЛИТЕЛЬНО СВЯЗАТЬСЯ!`;
    
    // ОТПРАВЛЯЕМ В ФОНЕ - У КЛИЕНТА НИЧЕГО НЕ ОТКРЫВАЕТСЯ!
    sendWhatsAppNotification(messageToYou);
    
    // =============================================
    // 2. ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ КЛИЕНТУ (ТОЛЬКО НА САЙТЕ!)
    // =============================================
    
    // Тексты на разных языках
    const orderMessages = {
        'ru': {
            title: 'Заявка отправлена!',
            message: `Спасибо, ${name}! Ваша заявка на услугу "${service}" успешно отправлена. Наш менеджер свяжется с вами в течение 30 минут.`
        },
        'en': {
            title: 'Request Sent!',
            message: `Thank you, ${name}! Your request for "${service}" has been successfully sent. Our manager will contact you within 30 minutes.`
        },
        'tr': {
            title: 'Talep Gönderildi!',
            message: `Teşekkürler, ${name}! "${service}" hizmeti için talebiniz başarıyla gönderildi. Yöneticimiz 30 dakika içinde sizinle iletişime geçecek.`
        }
    };
    
    const lang = language.toLowerCase().includes('ru') ? 'ru' : 
                language.toLowerCase().includes('en') ? 'en' : 'tr';
    
    const msg = orderMessages[lang];
    
    // ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ (НЕ ОТКРЫВАЕМ WHATSAPP!)
    showSuccessNotification(msg.title, msg.message);
    
    // =============================================
    // 3. СОХРАНЯЕМ ЗАЯВКУ
    // =============================================
    saveToLocalDatabase({
        type: 'order',
        name: name,
        phone: phone,
        district: district,
        service: service,
        message: message,
        language: language,
        timestamp: new Date().toISOString()
    });
    
    // =============================================
    // 4. СБРАСЫВАЕМ ФОРМУ
    // =============================================
    setTimeout(() => {
        e.target.reset();
    }, 1000);
    
    return false;
}

// =============================================
// ЛОКАЛЬНАЯ БАЗА ДАННЫХ
// =============================================

function saveToLocalDatabase(data) {
    const db = JSON.parse(localStorage.getItem('cleaningDatabase') || '{"registrations":[], "orders":[]}');
    
    if (data.type === 'registration') {
        db.registrations.push(data);
    } else if (data.type === 'order') {
        db.orders.push(data);
    }
    
    localStorage.setItem('cleaningDatabase', JSON.stringify(db));
    
    console.log('📊 База обновлена:', {
        регистраций: db.registrations.length,
        заявок: db.orders.length
    });
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
// АДМИН-ПАНЕЛЬ (скрытая)
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
    // Только для теста - отправляет вам сообщение в фоне
    const testMessage = '✅ Тестовое сообщение от сайта CleanPro Istanbul\n\nВремя: ' + new Date().toLocaleString();
    sendWhatsAppNotification(testMessage);
    alert('✅ Тестовое сообщение отправлено вам в WhatsApp (в фоновом режиме)');
}
