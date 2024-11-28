import Highcharts from "highcharts";

const highChartConfig = Highcharts.setOptions({
    chart: {
        backgroundColor: "#1e1e1e",
        style: { fontFamily: "Arial, sans-serif" },
    },
    title: { style: { color: "#ffffff" } },
    xAxis: {
        labels: { style: { color: "#ffffff" } },
        gridLineColor: "#333333",
    },
    yAxis: {
        labels: { style: { color: "#ffffff" } },
        title: { style: { color: "#ffffff" } },
        gridLineColor: "#333333",
    },
    legend: {
        itemStyle: { color: "#ffffff" },
        itemHoverStyle: { color: "#cccccc" },
    },
    tooltip: { backgroundColor: "#000000", style: { color: "#ffffff" } },
    plotOptions: {
        column: {
            borderWidth: 0,
            borderColor: "#333333",
        },
        bar: {
            borderWidth: 1,
            borderColor: "#333333",
        },
        pie: {
            borderWidth: 1,
            borderColor: "#333333",
            dataLabels: { style: { color: "#ffffff" } },
        },
    },
});

export default highChartConfig;
