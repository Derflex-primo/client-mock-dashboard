"use client";

import React from "react";
import HighchartsReact from "highcharts-react-official";
import highcharts from "./highcharts";
import mock from "./generated";

interface Appointment {
  patientId: string;
  provider: string;
  treatment: string;
  price: number;
  balance: number;
  appointmentDate: string;
  appointmentStatus: string;
}

const Dashboard = () => {
  const data: Appointment[] = mock;

  const appointmentStatusCounts = data.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.appointmentStatus] = (acc[item.appointmentStatus] || 0) + 1;
      return acc;
    },
    {}
  );

  const appointmentStatusChartOptions = {
    chart: { type: "pie" },
    title: { text: "Appointment Status Breakdown" },
    series: [
      {
        name: "Status",
        colorByPoint: true,
        data: Object.entries(appointmentStatusCounts).map(
          ([status, count]) => ({
            name: status,
            y: count,
          })
        ),
      },
    ],
  };

  const revenueByTreatment = data.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.treatment] = (acc[item.treatment] || 0) + item.price;
      return acc;
    },
    {}
  );

  const revenueByTreatmentChartOptions = {
    chart: { type: "column" },
    title: { text: "Revenue by Treatment" },
    xAxis: { categories: Object.keys(revenueByTreatment) },
    yAxis: { title: { text: "Revenue ($)" } },
    series: [
      {
        name: "Revenue",
        data: Object.values(revenueByTreatment).map((value) =>
          parseFloat(value.toFixed(2))
        ),
      },
    ],
  };

  const appointmentsByMonth = data.reduce<Record<string, number>>(
    (acc, item) => {
      const date = new Date(item.appointmentDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    },
    {}
  );

  const sortedMonths = Object.keys(appointmentsByMonth).sort();

  const appointmentsOverTimeChartOptions = {
    chart: { type: "line" },
    title: { text: "Appointments Over Time (Monthly)" },
    xAxis: { categories: sortedMonths },
    yAxis: { title: { text: "Number of Appointments" } },
    series: [
      {
        name: "Appointments",
        data: sortedMonths.map((month) => appointmentsByMonth[month]),
      },
    ],
  };

  const balanceData = data.map((item) => item.balance);
  const balanceDistributionChartOptions = {
    chart: { type: "column" },
    title: { text: "Balance Distribution" },
    xAxis: {
      title: { text: "Balance Amount ($)" },
      categories: ["0-100", "101-500", "501-1000", ">1000"],
    },
    yAxis: { title: { text: "Number of Appointments" } },
    series: [
      {
        name: "Balances",
        data: [
          balanceData.filter((b) => b <= 100).length,
          balanceData.filter((b) => b > 100 && b <= 500).length,
          balanceData.filter((b) => b > 500 && b <= 1000).length,
          balanceData.filter((b) => b > 1000).length,
        ],
      },
    ],
  };

  const providerPerformance = data.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.provider] = (acc[item.provider] || 0) + 1;
      return acc;
    },
    {}
  );

  const providerPerformanceChartOptions = {
    chart: { type: "bar" },
    title: { text: "Provider Performance" },
    xAxis: {
      categories: Object.keys(providerPerformance),
      title: { text: "Providers" },
    },
    yAxis: {
      title: { text: "Number of Appointments" },
      labels: { style: { color: "#ffffff" } },
    },
    series: [
      {
        name: "Appointments",
        data: Object.values(providerPerformance),
        colorByPoint: true,
      },
    ],
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          color: "#ffffff",
        },
      },
    },
  };

  const providerRevenue = data.reduce<Record<string, Record<string, number>>>(
    (acc, item) => {
      if (!acc[item.provider]) acc[item.provider] = {};
      acc[item.provider][item.treatment] =
        (acc[item.provider][item.treatment] || 0) + item.price;
      return acc;
    },
    {}
  );

  const providers = Object.keys(providerRevenue);
  const treatments = [...new Set(data.map((item) => item.treatment))];

  const providerRevenueChartOptions = {
    chart: { type: "bar" },
    title: { text: "Provider Revenue Comparison" },
    xAxis: {
      categories: providers,
      title: { text: "Providers" },
    },
    yAxis: {
      min: 0,
      title: { text: "Revenue ($)" },
    },
    plotOptions: {
      bar: { stacking: "normal" },
    },
    series: treatments.map((treatment) => ({
      name: treatment,
      data: providers.map((provider) =>
        parseFloat((providerRevenue[provider][treatment] || 0).toFixed(2))
      ),
    })),
  };

  const revenueByProvider = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.provider] = (acc[item.provider] || 0) + item.price;
    return acc;
  }, {});

  const totalRevenue = Object.values(revenueByProvider).reduce(
    (sum, revenue) => sum + revenue,
    0
  );

  const revenueByProviderChartOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Revenue Contribution by Provider",
    },
    plotOptions: {
      pie: {
        innerSize: "50%",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f}%",
        },
      },
    },
    series: [
      {
        name: "Revenue",
        colorByPoint: true,
        data: Object.entries(revenueByProvider).map(([provider, revenue]) => ({
          name: provider,
          y: parseFloat(((revenue / totalRevenue) * 100).toFixed(2)),
        })),
      },
    ],
  };

  const treatmentPopularity = data.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.treatment] = (acc[item.treatment] || 0) + 1;
      return acc;
    },
    {}
  );

  const treatmentPopularityChartOptions = {
    chart: { type: "heatmap" },
    title: { text: "Treatment Popularity" },
    xAxis: {
      categories: Object.keys(treatmentPopularity),
      title: { text: "Treatments" },
    },
    yAxis: {
      visible: false,
    },
    colorAxis: {
      min: 0,
      stops: [
        [0, "#e0f3f8"],
        [0.5, "#2592f7"],
        [1, "#1149f2"],
      ],
    },
    series: [
      {
        name: "Treatments",
        data: Object.entries(treatmentPopularity).map(([_, count], i) => [
          i,
          0,
          count,
        ]),
        dataLabels: {
          enabled: true,
          color: "#000000",
          format: "{point.value}",
        },
      },
    ],
  };

  const monthlyRevenue = data.reduce<Record<string, number>>((acc, item) => {
    const month = item.appointmentDate.substring(0, 7);
    acc[month] = (acc[month] || 0) + item.price;
    return acc;
  }, {});

  const monthlyRevenueChartOptions = {
    chart: { type: "area" },
    title: { text: "Monthly Revenue Trend" },
    xAxis: {
      categories: Object.keys(monthlyRevenue).sort(),
      title: { text: "Month" },
    },
    yAxis: {
      title: { text: "Revenue ($)" },
      allowDecimals: false,
    },
    series: [
      {
        name: "Revenue",
        data: Object.keys(monthlyRevenue)
          .sort()
          .map((month) => parseFloat(monthlyRevenue[month].toFixed(2))),
      },
    ],
  };

  const providerAppointmentsOverTime = data.reduce<
    Record<string, Record<string, number>>
  >((acc, item) => {
    const month = item.appointmentDate.substring(0, 7);
    if (!acc[item.provider]) acc[item.provider] = {};
    acc[item.provider][month] = (acc[item.provider][month] || 0) + 1;
    return acc;
  }, {});

  const providersTrendsChartOptions = {
    chart: { type: "line" },
    title: { text: "Appointment Trends by Provider" },
    xAxis: {
      categories: [
        ...new Set(data.map((item) => item.appointmentDate.substring(0, 7))),
      ].sort(),
    },
    yAxis: { title: { text: "Number of Appointments" } },
    series: Object.keys(providerAppointmentsOverTime).map((provider) => ({
      name: provider,
      data: [
        ...new Set(data.map((item) => item.appointmentDate.substring(0, 7))),
      ]
        .sort()
        .map((month) => providerAppointmentsOverTime[provider][month] || 0),
    })),
  };

  const treatmentSuccessByProvider = data.reduce<
    Record<string, { successful: number; unsuccessful: number }>
  >((acc, item) => {
    if (!acc[item.provider]) {
      acc[item.provider] = { successful: 0, unsuccessful: 0 };
    }
    if (item.appointmentStatus === "Completed") {
      acc[item.provider].successful += 1;
    } else if (["Cancelled", "No Show"].includes(item.appointmentStatus)) {
      acc[item.provider].unsuccessful += 1;
    }
    return acc;
  }, {});

  const stackedColumnChartOptions = {
    chart: { type: "column" },
    title: { text: "Treatment Success Rates by Provider" },
    xAxis: {
      categories: Object.keys(treatmentSuccessByProvider),
      title: { text: "Providers" },
    },
    yAxis: {
      min: 0,
      title: { text: "Number of Treatments" },
      stackLabels: { enabled: true },
    },
    plotOptions: {
      column: { stacking: "normal", dataLabels: { enabled: true } },
    },
    series: [
      {
        name: "Successful",
        data: Object.values(treatmentSuccessByProvider).map(
          (item) => item.successful
        ),
        color: "green",
      },
      {
        name: "Unsuccessful",
        data: Object.values(treatmentSuccessByProvider).map(
          (item) => item.unsuccessful
        ),
        color: "red",
      },
    ],
  };

  const patientVisitCounts = data.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.patientId] = (acc[item.patientId] || 0) + 1;
      return acc;
    },
    {}
  );

  const retentionData = {
    singleVisit: Object.values(patientVisitCounts).filter(
      (count) => count === 1
    ).length,
    repeatVisits: Object.values(patientVisitCounts).filter((count) => count > 1)
      .length,
  };
  const patientRetentionChartOptions = {
    chart: { type: "bar" },
    title: { text: "Patient Retention Rates" },
    xAxis: {
      categories: ["Single Visit", "Repeat Visits"],
      title: { text: "Patient Category" },
    },
    yAxis: { title: { text: "Number of Patients" } },
    series: [
      {
        name: "Patients",
        data: [retentionData.singleVisit, retentionData.repeatVisits],
        colorByPoint: true,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-10 mx-4 sm:mx-6 md:mx-10 mt-24 ">
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={appointmentStatusChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={revenueByTreatmentChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={appointmentsOverTimeChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={balanceDistributionChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={providerPerformanceChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={treatmentPopularityChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={providerRevenueChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={monthlyRevenueChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={revenueByProviderChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={providersTrendsChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={stackedColumnChartOptions}
        />
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <HighchartsReact
          highcharts={highcharts}
          options={patientRetentionChartOptions}
        />
      </div>
    </div>
  );
};

export default Dashboard;
