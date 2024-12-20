const tf = require('@tensorflow/tfjs');

function prepareData(data) {
    const prices = data.map(d => d.close);
    const inputs = [];
    const labels = [];

    for (let i = 0; i < prices.length - 1; i++) {
        inputs.push([prices[i]]);
        labels.push(prices[i + 1]);
    }

    return {
        inputs: tf.tensor2d(inputs),
        labels: tf.tensor2d(labels, [labels.length, 1])
    };
}


async function trainModel(inputs, labels) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fit(inputs, labels, { epochs: 50 });
    return model;
}

async function predictNextPrice(model, lastPrice) {
    const prediction = model.predict(tf.tensor2d([lastPrice], [1, 1]));
    return prediction.dataSync()[0];
}

// Trening i predykcja
fetchCryptoData('BTCUSDT').then(async data => {
    const { inputs, labels } = prepareData(data);
    const model = await trainModel(inputs, labels);

    const lastPrice = data[data.length - 1].close;
    const nextPrice = await predictNextPrice(model, lastPrice);

    console.log(`Next predicted price: ${nextPrice}`);
});
