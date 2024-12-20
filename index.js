const { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } = require('chart.js');
const { createCanvas } = require('canvas');
const fs = require('fs');

// Регистрируем компоненты Chart.js
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend);

async function renderChart(data, labels, outputFile) {
    const width = 800; // Ширина графика
    const height = 600; // Высота графика
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line', // Тип графика
        data: {
            labels: labels,
            datasets: [{
                label: 'Example Data',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Chart.js Example'
                }
            }
        }
    });

    // Сохраняем график в файл
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputFile, buffer);
    console.log(`Chart saved as ${outputFile}`);
}

// Пример данных для графика
const exampleData = [10, 20, 30, 40, 50];
const exampleLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
renderChart(exampleData, exampleLabels, 'output-chart.png');
