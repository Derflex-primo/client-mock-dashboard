"use client";

import React from "react";
import HighchartsReact from "highcharts-react-official";
import Link from "next/link";
import highcharts from "./highcharts";
import mock from "../public/mock-api.json";

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
        data: Object.values(revenueByTreatment),
      },
    ],
  };

  const appointmentsByDate = data.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.appointmentDate] = (acc[item.appointmentDate] || 0) + 1;
      return acc;
    },
    {}
  );

  const appointmentsOverTimeChartOptions = {
    chart: { type: "line" },
    title: { text: "Appointments Over Time" },
    xAxis: { categories: Object.keys(appointmentsByDate).sort() },
    yAxis: { title: { text: "Number of Appointments" } },
    series: [
      {
        name: "Appointments",
        data: Object.keys(appointmentsByDate)
          .sort()
          .map((date) => appointmentsByDate[date]),
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
      data: providers.map(
        (provider) => providerRevenue[provider][treatment] || 0
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

  return (
    <div>
      <h1 className="w-full fixed top-0 z-10 px-7 py-2 sm:py-4 bg-cyan-600 text-center text-lg md:text-xl font-medium text-white">
        clinical practice dashboard{" "}
        <Link
          href="https://daryldeogracias.com"
          className="font-normal text-sm"
        >
          daryldeogracias©2024
        </Link>
      </h1>
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
      </div>
    </div>
  );
};

export default Dashboard;
