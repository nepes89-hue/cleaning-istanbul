// =============================================
// ОСНОВНЫЕ НАСТРОЙКИ
// =============================================

// ВАШ НОМЕР WHATSAPP (ОСТАВЛЯЕМ, НО ПОКА НЕ ИСПОЛЬЗУЕМ)
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
// УВЕДОМЛЕНИЯ ДЛЯ АДМИНИСТРАТОРА (НА САЙТЕ)
// =============================================

function showAdminNotification(title, data) {
    // Создаем уведомление для администратора
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-left: 5px solid #e74c3c;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        padding: 20px;
        max-width: 350px;
        width: 100%;
        z-index: 999999;
        animation: slideInRight 0.3s ease;
        font-family: 'Segoe UI', Arial, sans-serif;
    `;

    let content = '';
    
    if (title === 'registration') {
        content = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background: #2ecc71; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 12px;">
                    📝
                </div>
                <div>
                    <h4 style="margin: 0; color: #2c3e50; font-size: 16px;">НОВАЯ РЕГИСТРАЦИЯ!</h4>
                    <p style="margin: 5px 0 0 0; color: #7f8c8d; font-size: 12px;">${new Date().toLocaleString()}</p>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>👤 Имя:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>📱 Телефон:</strong> ${data.phone}</p>
                <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${data.email || 'не указан'}</p>
                <p style="margin: 5px 0;"><strong>🎉 Скидка:</strong> <span style="color: #e74c3c; font-weight: bold;">${data.discount}%</span></p>
                <p style="margin: 5px 0;"><strong>🌐 Язык:</strong> ${data.language}</p>
            </div>
        `;
    } else if (title === 'order') {
        content = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background: #e74c3c; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 12px;">
                    🚀
                </div>
                <div>
                    <h4 style="margin: 0; color: #2c3e50; font-size: 16px;">НОВАЯ ЗАЯВКА!</h4>
                    <p style="margin: 5px 0 0 0; color: #7f8c8d; font-size: 12px;">${new Date().toLocaleString()}</p>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>👤 Имя:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>📱 Телефон:</strong> ${data.phone}</p>
                <p style="margin: 5px 0;"><strong>📍 Район:</strong> ${data.district}</p>
                <p style="margin: 5px 0;"><strong>🛠 Услуга:</strong> ${data.service}</p>
                <p style="margin: 5px 0;"><strong>📝 Комментарий:</strong> ${data.message || 'нет'}</p>
                <p style="margin: 5px 0;"><strong>🌐 Язык:</strong> ${data.language}</p>
            </div>
        `;
    }

    content += `
        <div style="display: flex; gap: 10px;">
            <button onclick="copyPhoneToClipboard('${data.phone}')" style="
                flex: 1;
                padding: 10px;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            ">
                📋 Копировать телефон
            </button>
            <button onclick="this.closest('div[style*=\'position: fixed\']').remove()" style="
                padding: 10px 15px;
                background: #95a5a6;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">
                ✕
            </button>
        </div>
    `;

    notification.innerHTML = content;
    document.body.appendChild(notification);

    // Автоматически скрыть через 30 секунд
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 30000);
}

// Копирование телефона в буфер обмена
window.copyPhoneToClipboard = function(phone) {
    navigator.clipboard.writeText(phone).then(() => {
        alert('✅ Номер телефона скопирован: ' + phone);
    }).catch(() => {
        prompt('📋 Скопируйте номер вручную:', phone);
    });
};

// Стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

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
    window.open(`https://wa.me/905550644089?text=${message}`, '_blank');
    closeNotification();
}

// =============================================
// РЕГИСТРАЦИЯ
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
    // 1. ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ АДМИНУ (ВАМ!)
    // =============================================
    showAdminNotification('registration', {
        name: name,
        phone: turkishPhone,
        email: email,
        discount: discount,
        language: language
    });
    
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
    // 3. ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ КЛИЕНТУ
    // =============================================
    
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
    
    showSuccessNotification(msg.title, msg.message, msg.discount);
    
    // Показываем цены
    setTimeout(() => {
        const priceReg = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        
        if (priceReg) priceReg.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
    }, 500);
    
    // =============================================
    // 4. СОХРАНЯЕМ В БАЗУ
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
    
    return false;
}

// =============================================
// ОТПРАВКА ЗАЯВКИ
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
    // 1. ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ АДМИНУ (ВАМ!)
    // =============================================
    showAdminNotification('order', {
        name: name,
        phone: phone,
        district: district,
        service: service,
        message: message,
        language: language
    });
    
    // =============================================
    // 2. ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ КЛИЕНТУ
    // =============================================
    
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
    console.log('📊 База обновлена:', db);
}

// =============================================
// КАЛЬКУЛЯТОР
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
// ПЛАВНАЯ ПРОКРУТКА
// =============================================

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
    
    if (localStorage.getItem('hasPriceAccess') === 'true') {
        const priceReg = document.getElementById('priceRegistration');
        const actualPrices = document.getElementById('actualPrices');
        
        if (priceReg) priceReg.style.display = 'none';
        if (actualPrices) actualPrices.style.display = 'block';
    }
});

// =============================================
// ЭКСПОРТ БАЗЫ
// =============================================

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
    
    alert(`✅ База данных экспортирована!\n📊 Регистраций: ${db.registrations.length}\n📊 Заявок: ${db.orders.length}`);
}

// =============================================
// АДМИН-ПАНЕЛЬ
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
    if (confirm('⚠️ Очистить всю базу данных?')) {
        localStorage.removeItem('cleaningDatabase');
        localStorage.removeItem('cleaningUser');
        localStorage.removeItem('hasPriceAccess');
        localStorage.removeItem('userDiscount');
        updateStats();
        alert('🗑️ База данных очищена');
    }
}

function testNotification() {
    showAdminNotification('registration', {
        name: 'Тестовый Клиент',
        phone: '905550644089',
        email: 'test@test.com',
        discount: 10,
        language: 'ru'
    });
}

// Обновлять статистику каждые 10 секунд
setInterval(updateStats, 10000);
