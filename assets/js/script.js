// Обработка формы заказа
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.querySelector('.order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 30 минут.');
            this.reset();
        });
    }
    
    // Плавная прокрутка
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
    
    // Проверяем регистрацию для доступа к ценам
    if (localStorage.getItem('hasPriceAccess') === 'true') {
        const priceProtection = document.getElementById('priceProtection');
        const priceContent = document.getElementById('priceContent');
        if (priceProtection && priceContent) {
            priceProtection.style.display = 'none';
            priceContent.style.display = 'block';
        }
    }
});

// Калькулятор стоимости
function calculatePrice() {
    const service = document.getElementById('calcService').value;
    const size = parseFloat(document.getElementById('calcSize').value) || 0;
    let price = 0;
    let serviceName = '';
    
    // Цены в TL
    const prices = {
        'sofa': 600,
        'armchair': 350,
        'mattress': 450,
        'carpet': 180,
        'car': 1200,
        'curtain': 250,
        'chair': 150
    };
    
    // Расчёт
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
    
    // Вывод результата
    const resultElement = document.getElementById('calcResult');
    if (resultElement) {
        if (price > 0) {
            resultElement.innerHTML = 
                `<h4>${serviceName}</h4>
                 <p>Примерная стоимость: <strong>${price} TL</strong></p>
                 ${service === 'carpet' ? `<small>Площадь: ${size} м² × 180 TL/м²</small>` : ''}`;
            
            // Обновляем кнопку заказа
            const orderBtn = document.getElementById('calcOrderBtn');
            if (orderBtn) {
                orderBtn.style.display = 'block';
                orderBtn.href = `#order?service=${service}&price=${price}`;
            }
        } else {
            resultElement.innerHTML = 'Выберите услугу для расчёта';
        }
    }
}

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

// Регистрация для доступа к ценам
function registerForPrices() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
    }
    
    // Сохраняем данные пользователя
    const userData = {
        name: name,
        phone: phone,
        email: document.getElementById('regEmail').value || '',
        registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('cleaningUser', JSON.stringify(userData));
    localStorage.setItem('hasPriceAccess', 'true');
    
    // Показываем цены
    document.getElementById('priceRegistration').style.display = 'none';
    const priceContent = document.getElementById('actualPrices');
    if (priceContent) {
        priceContent.style.display = 'block';
    }
    
    // Показываем приветствие
    alert(`Спасибо за регистрацию, ${name}! Теперь вам доступны все цены.\nПароль для будущего входа: clean123`);
    
    // Прокручиваем к ценам
    const pricesSection = document.querySelector('#prices');
    if (pricesSection) {
        pricesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Автоматическое обновление калькулятора
function updateCalculator() {
    const serviceSelect = document.getElementById('calcService');
    const sizeInput = document.getElementById('calcSize');
    
    if (serviceSelect && sizeInput) {
        serviceSelect.addEventListener('change', function() {
            calculatePrice();
            // Показываем/скрываем поле размера для ковров
            if (this.value === 'carpet') {
                sizeInput.parentElement.style.display = 'block';
            } else {
                sizeInput.parentElement.style.display = 'none';
            }
        });
        
        sizeInput.addEventListener('input', calculatePrice);
    }
}

// Инициализация при загрузке
window.onload = function() {
    updateCalculator();
};
