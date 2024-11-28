"use client";

import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highChartConfig from "./highcharts";
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
  highChartConfig;
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
    chart: { type: "column" },
    title: { text: "Provider Performance" },
    xAxis: { categories: Object.keys(providerPerformance) },
    yAxis: { title: { text: "Number of Appointments" } },
    series: [
      {
        name: "Appointments",
        data: Object.values(providerPerformance),
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
    chart: { type: "column" },
    title: { text: "Treatment Popularity" },
    xAxis: { categories: Object.keys(treatmentPopularity) },
    yAxis: { title: { text: "Frequency" } },
    series: [
      {
        name: "Treatments",
        data: Object.values(treatmentPopularity),
      },
    ],
  };

  return (
    <div>
      <h1 className="w-full fixed top-0 z-10 px-7 py-4 bg-cyan-600 text-lg font-medium text-white">
        Healthcare Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-10 mx-4 sm:mx-6 md:mx-10 mt-24 ">
        <div className="relative rounded-xl overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={appointmentStatusChartOptions}
          />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={revenueByTreatmentChartOptions}
          />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={appointmentsOverTimeChartOptions}
          />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={balanceDistributionChartOptions}
          />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={providerPerformanceChartOptions}
          />
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <HighchartsReact
            highcharts={Highcharts}
            options={treatmentPopularityChartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
