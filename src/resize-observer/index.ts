import { createChart, LineData, PriceLineSource, UTCTimestamp } from "lightweight-charts";

const chartContainer = document.getElementById("main-chart") as HTMLDivElement;
const chart = createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: {
        fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    },
});

const series = chart.addLineSeries({
    priceLineSource: PriceLineSource.LastVisible,
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
        value: Math.sin((i * 6 * Math.PI) / 180) * 10,
    });

    date.setDate(date.getDate() + 1);
}

series.setData(data);

const observerCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    for (const entry of entries) {
        if (entry.target == chartContainer) {
            if (entry.contentBoxSize) {
                if (Array.isArray(entry.contentBoxSize)) {
                    chart.resize(entry.contentBoxSize[0].inlineSize, entry.contentBoxSize[0].blockSize);
                } else {
                    chart.resize(entry.contentBoxSize.inlineSize, entry.contentBoxSize.blockSize);
                }
            } else {
                chart.resize(entry.contentRect.width, entry.contentRect.height);
            }
        }
    }
};

const observer = new ResizeObserver(observerCallback);
observer.observe(chartContainer);
