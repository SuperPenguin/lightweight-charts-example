import { createChart, LineData, SeriesMarker, UTCTimestamp } from "lightweight-charts";

const chartRoot = document.getElementById("main-chart") as HTMLElement;
const chart = createChart(chartRoot, {
    width: 800,
    height: 600,
});

const lineSeries = chart.addLineSeries({
    lineWidth: 2,
});
const data: LineData[] = [];
const marker: SeriesMarker<UTCTimestamp>[] = [];

const dateToUnix = (date: Date) => {
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

const date = new Date();
date.setHours(0, 0, 0, 0);

for (let i = 0; i < 360; i++) {
    const value = Math.sin((i * 2 * Math.PI) / 180) * 10;

    if (Math.abs(value) == 10) {
        marker.push({
            time: dateToUnix(date) as UTCTimestamp,
            position: value > 0 ? "aboveBar" : "belowBar",
            shape: value > 0 ? "arrowUp" : "arrowDown",
            color: "red",
            text: value > 0 ? "UP" : " DOWN",
        });
    }

    data.push({
        time: dateToUnix(date) as UTCTimestamp,
        value: value,
    });

    date.setDate(date.getDate() + 1);
}

lineSeries.setData(data);
lineSeries.setMarkers(marker);
