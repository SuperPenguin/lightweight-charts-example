import { createChart, LineData, LineStyle, UTCTimestamp } from "lightweight-charts";

const chartContainer = document.getElementById("main-chart") as HTMLDivElement;
const chart = createChart(chartContainer, {
    width: 800,
    height: 600
});
const series = chart.addLineSeries({
    color: "blue",
    priceLineVisible: false
});
const chartViewport = chartContainer.querySelector("table > tr > td:nth-child(2) > div") as HTMLDivElement;
const priceLineInput = document.getElementById("priceline-value") as HTMLInputElement;

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

let prevPriceLineValue = Number.parseFloat(priceLineInput.value);
const priceLine = series.createPriceLine({
    axisLabelVisible: true,
    color: "red",
    lineStyle: LineStyle.Solid,
    lineWidth: 1,
    price: prevPriceLineValue
});

const buyElem = document.createElement("button");
let prevBuyPosY: number = 0;

const movePriceLine = (price: number) => {
    if (chart == null || series == null) return;

    if (price != prevPriceLineValue) {
        priceLine.applyOptions({
            price: price
        });

        prevPriceLineValue = price;
    }

    let posY = series.priceToCoordinate(price);
    if (posY != null && posY != prevBuyPosY) {
        buyElem.classList.remove("hidden");
        buyElem.style.top = `${posY as number}px`;
        prevBuyPosY = posY as number;
    } else {
        buyElem.classList.add("hidden");
    }
};

buyElem.classList.add("priceline-buy", "hidden");
buyElem.innerHTML = "BUY";
chartViewport.appendChild(buyElem);
movePriceLine(prevPriceLineValue);

let animationID: number;
const frameRequestCallback = () => {
    // Repeat if chart and series still exist
    if (chart == null || series == null) return;

    movePriceLine(prevPriceLineValue);
    animationID = requestAnimationFrame(frameRequestCallback);
};
animationID = requestAnimationFrame(frameRequestCallback);

priceLineInput.addEventListener("change", (ev) => {
    movePriceLine(Number.parseFloat(priceLineInput.value));
});
