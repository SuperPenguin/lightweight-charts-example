import { createChart, UTCTimestamp } from "lightweight-charts";

const areaCheck = document.getElementById("area-visible") as HTMLInputElement;
areaCheck.addEventListener("change", () => {
  area.applyOptions({
    visible: areaCheck.checked
  });
});

const candlestickCheck = document.getElementById("candlestick-visible") as HTMLInputElement;
candlestickCheck.addEventListener("change", () => {
  candlestick.applyOptions({
    visible: candlestickCheck.checked
  });
});

const volumeCheck = document.getElementById("volume-visible") as HTMLInputElement;
volumeCheck.addEventListener("change", () => {
  volume.applyOptions({
    visible: volumeCheck.checked
  });
});

const chartRoot = document.getElementById("main-chart") as HTMLDivElement;
const chart = createChart(chartRoot, {
  width: 800,
  height: 600,
  timeScale: {
    timeVisible: true,
    secondsVisible: true
  }
});
const area = chart.addAreaSeries({
  visible: areaCheck.checked,
  lineWidth: 1
});
const candlestick = chart.addCandlestickSeries({
  visible: candlestickCheck.checked
});
const volume = chart.addHistogramSeries({
  visible: volumeCheck.checked,
  priceScaleId: "volume",
  priceFormat: {
    type: "volume"
  }
});
volume.priceScale().applyOptions({
  scaleMargins: {
    top: 0.9,
    bottom: 0
  }
});

interface MainData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const mainData: MainData[] = [];

function addData(data: MainData) {
  mainData.push(data);

  area.update({
    time: data.time,
    value: data.close
  });

  candlestick.update({
    time: data.time,
    open: data.open,
    high: data.high,
    low: data.low,
    close: data.close
  });

  volume.update({
    time: data.time,
    value: data.volume,
    color: data.open > data.close ? "#ef535080" : "#26a69a80"
  });
}

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let lastClose = 1000;

setInterval(() => {
  const randoms = [];

  for (let i = 0; i < 3; i++) {
    randoms.push(getRandomRange(lastClose - 10, lastClose + 10));
  }
  randoms.sort((a, b) => b - a);

  const open = lastClose;
  const high = randoms[0];
  const low = randoms[2];
  const close = randoms[1];
  const volume = Math.round(getRandomRange(1000, 10000));

  addData({
    time: Math.round(Date.now() / 1000) as UTCTimestamp,
    open: open,
    high: high,
    low: low,
    close: close,
    volume: volume
  });
  lastClose = close;
}, 1000);
