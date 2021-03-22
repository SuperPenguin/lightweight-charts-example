import { createChart, LineData, PriceLineSource, UTCTimestamp } from "lightweight-charts";

interface HTMLResizeableElement extends HTMLElement {
  handleResize?: (entry: ResizeObserverEntry) => void;
}

const chartContainer = document.getElementById("main-chart") as HTMLResizeableElement;
const chart = createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height: chartContainer.clientHeight,
  layout: {
    fontFamily:
      "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
  }
});

chartContainer.handleResize = (entry) => {
  if (entry.contentBoxSize) {
    if (Array.isArray(entry.contentBoxSize)) {
      chart.resize(entry.contentBoxSize[0].inlineSize, entry.contentBoxSize[0].blockSize);
    } else {
      // Old Firefox behaviour
      // @ts-ignore
      chart.resize(entry.contentBoxSize.inlineSize, entry.contentBoxSize.blockSize);
    }
  } else {
    chart.resize(entry.contentRect.width, entry.contentRect.height);
  }
};

const series = chart.addLineSeries({
  priceLineSource: PriceLineSource.LastVisible
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

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    let element = entry.target as HTMLResizeableElement;

    if (element.handleResize) {
      element.handleResize(entry);
    }
  }
});
observer.observe(chartContainer);
