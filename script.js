// Функция для получения данных о криптовалюте
async function fetchCryptoData(symbol = 'BTCUSDT', interval = '1d', limit = 30) {
    const API_URL = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    try {
        console.log('Fetching data from:', API_URL); // Лог URL
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data received:', data); // Лог данных
        return data.map(item => ({
            time: new Date(item[0]).toLocaleDateString(), // Дата
            close: parseFloat(item[4])                  // Цена закрытия
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Возвращаем пустой массив, если ошибка
    }
}

// Функция для отрисовки графика
async function renderChart() {
    console.log('Вызов renderChart'); // Лог вызова renderChart
    const data = await fetchCryptoData(); // Загружаем данные
    if (!data || data.length === 0) {
        console.error('No data available to display.'); // Ошибка, если данных нет
        return;
    }

    // Подготовка данных для графика
    const labels = data.map(item => item.time); // Метки времени (даты)
    const prices = data.map(item => item.close); // Цены

    // Настройка и отрисовка графика
    const ctx = document.getElementById('cryptoChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // Тип графика
        data: {
            labels: labels, // Метки времени
            datasets: [{
                label: 'BTC/USDT', // Подпись
                data: prices,      // Данные цен
                borderColor: 'rgba(75, 192, 192, 1)',   // Цвет линии
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Цвет заливки
                tension: 0.1 // Сглаживание линии
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'BTC/USDT Price Chart' // Заголовок графика
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date' // Подпись оси X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)' // Подпись оси Y
                    }
                }
            }
        }
    });
}

// Вызов функции для отрисовки графика
renderChart();
