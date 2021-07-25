import { createChart, LineData, LogicalRange, LogicalRangeChangeEventHandler, UTCTimestamp } from "lightweight-charts";

function localDateToTimestamp(date: Date): UTCTimestamp {
  return (Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    0
  ) / 1000) as UTCTimestamp;
}

const chartRoot = document.getElementById("main-chart") as HTMLDivElement;
const chart = createChart(chartRoot, {
  width: 800,
  height: 400,
  timeScale: {
    timeVisible: true
  },
  watermark: {
    color: "red",
    horzAlign: "left",
    vertAlign: "top",
    visible: true,
    text: "sine"
  }
});
const line = chart.addLineSeries({
  color: "red"
});

const chartRoot2 = document.getElementById("main-chart2") as HTMLDivElement;
const chart2 = createChart(chartRoot2, {
  width: 800,
  height: 400,
  timeScale: {
    timeVisible: true
  },
  watermark: {
    color: "blue",
    horzAlign: "left",
    vertAlign: "top",
    visible: true,
    text: "cosine"
  }
});
const line2 = chart2.addLineSeries({
  color: "blue"
});

const sineData: LineData[] = [];
const cosineData: LineData[] = [];

const today = new Date();
today.setHours(0, 0, 0, 0);

for (let i = 0; i < 3600; i++) {
  const time = new Date(today);
  time.setMinutes(time.getMinutes() + i);

  sineData.push({
    time: localDateToTimestamp(time),
    value: Math.sin((i * Math.PI) / 180)
  });

  cosineData.push({
    time: localDateToTimestamp(time),
    value: Math.cos((i * Math.PI) / 180)
  });
}

line.setData(sineData);
line2.setData(cosineData);

// Sync Timescale
function isLogicalRangeSame(l1: LogicalRange, l2: LogicalRange): boolean {
  return l1.from == l2.from && l1.to == l2.from;
}

const handler: LogicalRangeChangeEventHandler = (logicalRange) => {
  const logicalRange2 = chart2.timeScale().getVisibleLogicalRange();

  if (logicalRange != null && logicalRange2 != null && !isLogicalRangeSame(logicalRange, logicalRange2)) {
    chart2.timeScale().setVisibleLogicalRange({
      from: logicalRange.from,
      to: logicalRange.to
    });
  }
};

const handler2: LogicalRangeChangeEventHandler = (logicalRange2) => {
  const logicalRange = chart.timeScale().getVisibleLogicalRange();

  if (logicalRange != null && logicalRange2 != null && !isLogicalRangeSame(logicalRange, logicalRange2)) {
    chart.timeScale().setVisibleLogicalRange({
      from: logicalRange2.from,
      to: logicalRange2.to
    });
  }
};

// This will prevent chart1 change -> chart2 change -> chart1 change -> ......
// However this only update when user actually interact with chart within the element
// It won't update if user drag chart and cursor move beyond element
chartRoot.addEventListener("mouseenter", (ev) => {
  chart.timeScale().subscribeVisibleLogicalRangeChange(handler);
});
chartRoot.addEventListener("mouseleave", (ev) => {
  chart.timeScale().unsubscribeVisibleLogicalRangeChange(handler);
});

chartRoot2.addEventListener("mouseenter", (ev) => {
  chart2.timeScale().subscribeVisibleLogicalRangeChange(handler2);
});
chartRoot2.addEventListener("mouseleave", (ev) => {
  chart2.timeScale().unsubscribeVisibleLogicalRangeChange(handler2);
});
