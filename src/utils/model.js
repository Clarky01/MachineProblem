import * as tf from "@tensorflow/tfjs";

export const buildAndTrainModel = async (data, normalizedQuantities) => {
  const xs = data.map((row) => [row.sales_date, row.product_description]);
  const ys = normalizedQuantities;

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: "meanSquaredError",
  });

  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

  await model.fit(xsTensor, ysTensor, {
    epochs: 100,
    batchSize: 32,
    verbose: 0,
  });

  return model;
};

export const predict = (model, inputs) => {
  const inputsTensor = tf.tensor2d(inputs);
  const predictions = model.predict(inputsTensor);
  return predictions.dataSync();
};
