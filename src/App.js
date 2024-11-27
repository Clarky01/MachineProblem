import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import { preprocessData } from "./utils/preprocess";
import { buildAndTrainModel, predict } from "./utils/model";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [actualSales, setActualSales] = useState([]);
  const [predictedSales, setPredictedSales] = useState([]);

  const handleDataLoaded = async (data) => {
    const { processedData, normalizedQuantities } = preprocessData(data);
    setActualSales(normalizedQuantities);

    const model = await buildAndTrainModel(processedData, normalizedQuantities);

    const futureInputs = Array.from({ length: 6 }, (_, i) => [
      processedData.length + i + 1,
      0, // Assuming product index 0 for simplicity
    ]);

    const predictions = predict(model, futureInputs);
    setPredictedSales(Array.from(predictions));
  };

  const chartData = {
    labels: Array.from(
      { length: actualSales.length + predictedSales.length },
      (_, i) => `Month ${i + 1}`
    ),
    datasets: [
      {
        label: "Actual Sales",
        data: actualSales,
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
      },
      {
        label: "Predicted Sales",
        data: [...Array(actualSales.length).fill(null), ...predictedSales],
        borderColor: "red",
        backgroundColor: "red",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>Sales Forecasting</h1>
      <FileUpload onDataLoaded={handleDataLoaded} />
      {actualSales.length > 0 && predictedSales.length > 0 && (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default App;
