import { createChart, LineData, PriceLineSource, UTCTimestamp } from "lightweight-charts";

const chartContainer = document.getElementById("main-chart") as HTMLElement;
const chart = createChart(chartContainer, {
  width: 800,
  height: 600,
  layout: {
    fontFamily:
      "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
  }
});

const series = chart.addLineSeries({
  priceLineSource: PriceLineSource.LastVisible,
  priceFormat: {
    precision: 2,
    minMove: 0.01
  }
});
const data: LineData[] = [];

let date = new Date();
date.setHours(0, 0, 0, 0);

let dateToUnix = (date: Date) => {
  return (
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      0
    ) / 1000
  );
};

for (let i = 0; i < 360; i++) {
  data.push({
    time: dateToUnix(date) as UTCTimestamp,
    value: Math.sin((i * 6 * Math.PI) / 180) * 10
  });

  date.setDate(date.getDate() + 1);
}

series.setData(data);

const forwardButton = document.createElement("button");
forwardButton.innerHTML = ">>";
forwardButton.classList.add("forward");

forwardButton.addEventListener("click", (ev) => {
  chart.timeScale().scrollToRealTime();
});

const chartViewport = chartContainer.querySelector("table > tr > td:nth-child(2) > div") as HTMLDivElement;
chartViewport.append(forwardButton);

const useApplyOptions = document.getElementById("apply-options-check") as HTMLInputElement;

const size1 = document.getElementById("size-1") as HTMLButtonElement;
size1.addEventListener("click", (ev) => {
  if (useApplyOptions.checked) {
    chart.applyOptions({
      width: 400,
      height: 300
    });
  } else {
    chart.resize(400, 300);
  }
});

const size2 = document.getElementById("size-2") as HTMLButtonElement;
size2.addEventListener("click", (ev) => {
  if (useApplyOptions.checked) {
    chart.applyOptions({
      width: 800,
      height: 600
    });
  } else {
    chart.resize(800, 600);
  }
});

const size3 = document.getElementById("size-3") as HTMLButtonElement;
size3.addEventListener("click", (ev) => {
  if (useApplyOptions.checked) {
    chart.applyOptions({
      width: 1024,
      height: 768
    });
  } else {
    chart.resize(1024, 768);
  }
});

const precision1 = document.getElementById("precision-1") as HTMLButtonElement;
precision1.addEventListener("click", (ev) => {
  series.applyOptions({
    priceFormat: {
      precision: 2,
      minMove: 0.01
    }
  });
});

const precision2 = document.getElementById("precision-2") as HTMLButtonElement;
precision2.addEventListener("click", (ev) => {
  series.applyOptions({
    priceFormat: {
      precision: 4,
      minMove: 0.0001
    }
  });
});

const precision3 = document.getElementById("precision-3") as HTMLButtonElement;
precision3.addEventListener("click", (ev) => {
  series.applyOptions({
    priceFormat: {
      precision: 6,
      minMove: 0.000001
    }
  });
});
