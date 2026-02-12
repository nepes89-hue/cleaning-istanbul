// =============================================
// ЗАГРУЗКА ЦЕН ИЗ prices.json
// =============================================
let SITE_PRICES = null;

async function loadPrices() {
    try {
        const response = await fetch('/cleaning-istanbul/prices.json');
        if (!response.ok) throw new Error('Файл не найден');
        const data = await response.json();
        SITE_PRICES = data;
        console.log('✅ Цены загружены из prices.json', data);
        updatePricesOnPage(); // обновить цены на странице
    } catch (error) {
        console.warn('⚠️ Не удалось загрузить prices.json, использую стандартные цены');
        // Стандартные цены (на всякий случай)
        SITE_PRICES = {
            ru: {
                "Диван (2-местный)": { price: 600, priceMax: 900, category: "furniture", icon: "couch" },
                "Кресло": { price: 350, priceMax: 600, category: "furniture", icon: "chair" },
                "Матрас": { price: 450, priceMax: 700, category: "furniture", icon: "bed" },
                "Ковёр": { price: 180, priceMax: 350, category: "carpet", icon: "rug" },
                "Автомобиль (легковой)": { price: 1200, priceMax: 2500, category: "car", icon: "car" },
                "Шторы": { price: 250, priceMax: 500, category: "other", icon: "curtain" },
                "Стул": { price: 150, priceMax: 300, category: "furniture", icon: "chair" }
            }
        };
        updatePricesOnPage();
    }
}

// =============================================
// ОБНОВЛЕНИЕ ЦЕН НА СТРАНИЦЕ
// =============================================
function updatePricesOnPage() {
    // Определяем текущий язык
    const lang = getCurrentLanguage().toLowerCase();
    const langCode = lang.includes('en') ? 'en' : lang.includes('tr') ? 'tr' : 'ru';
    const prices = SITE_PRICES[langCode] || SITE_PRICES.ru;

    // 1. Обновляем блоки с ценами в услугах (service-price)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const titleElem = card.querySelector('.service-name');
        if (!titleElem) return;
        const title = titleElem.textContent.trim();
        // Ищем соответствующую цену в prices
        let found = null;
        for (let [name, data] of Object.entries(prices)) {
            if (title.includes(name) || name.includes(title)) {
                found = data;
                break;
            }
        }
        if (found) {
            const priceElem = card.querySelector('.service-price');
            if (priceElem) priceElem.textContent = `от ${found.price} TL`;
        }
    });

    // 2. Обновляем таблицу цен
    const table = document.querySelector('.prices-table');
    if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const serviceCell = row.cells[0];
            if (!serviceCell) return;
            const serviceName = serviceCell.textContent.trim();
            let found = null;
            for (let [name, data] of Object.entries(prices)) {
                if (serviceName.includes(name) || name.includes(serviceName)) {
                    found = data;
                    break;
                }
            }
            if (found) {
                const priceCell = row.cells[2]; // столбец цены
                if (priceCell) priceCell.innerHTML = `${found.price} - ${found.priceMax || found.price + 300} TL`;
            }
        });
    }
}

// =============================================
// ВСПОМОГАТЕЛЬНАЯ: ТЕКУЩИЙ ЯЗЫК
// =============================================
function getCurrentLanguage() {
    const active = document.querySelector('.lang-btn.active');
    return active ? active.textContent : 'ru';
}

// =============================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    loadPrices(); // Загружаем цены и обновляем страницу
    // ... остальной ваш код (плавная прокрутка и т.д.) ...
});

// =============================================
// КАЛЬКУЛЯТОР (исправленный, использует SITE_PRICES)
// =============================================
function calculatePrice() {
    if (!SITE_PRICES) {
        setTimeout(calculatePrice, 500); // ждём загрузки цен
        return;
    }
    const lang = getCurrentLanguage().toLowerCase();
    const langCode = lang.includes('en') ? 'en' : lang.includes('tr') ? 'tr' : 'ru';
    const prices = SITE_PRICES[langCode] || SITE_PRICES.ru;

    const service = document.getElementById('calcService').value;
    const size = parseFloat(document.getElementById('calcSize').value) || 0;

    // Маппинг ID -> название услуги (приблизительно)
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
    for (let [name, data] of Object.entries(prices)) {
        if (name.includes(serviceNamePattern) || serviceNamePattern.includes(name)) {
            priceData = data;
            break;
        }
    }

    let price = 0;
    let serviceName = '';
    if (priceData) {
        price = (service === 'carpet') ? priceData.price * size : priceData.price;
        serviceName = Object.keys(prices).find(k => prices[k] === priceData);
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
                <p>Ваша скидка: <strong style="color:#2ecc71;">${discount}% (${discountAmount.toFixed(0)} TL)</strong></p>
                <p style="font-size:1.5rem; color:#e74c3c;">Итоговая цена: <strong>${finalPrice.toFixed(0)} TL</strong></p>
            `;
        } else {
            html += `<p>Цена: <strong style="font-size:1.5rem; color:#e74c3c;">${price} TL</strong></p>`;
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
// СОХРАНЯЕМ ВЕСЬ ВАШ СУЩЕСТВУЮЩИЙ КОД НИЖЕ
// (функции: registerForPrices, submitOrderForm, saveToLocalDatabase и т.д.)
// =============================================
// Вставьте сюда все ваши остальные функции, которые были в script.js,
// чтобы не потерять регистрацию, заявки и т.п.
