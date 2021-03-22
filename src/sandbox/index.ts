import { createChart } from "lightweight-charts";

const chartRoot = document.getElementById("main-chart") as HTMLDivElement;
const chart = createChart(chartRoot, {
  width: 800,
  height: 600
});
