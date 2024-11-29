"use client";

import dynamic from "next/dynamic";

const DashboardClientOnly = dynamic(() => import("./components/Dashboard"), {
  ssr: false,
});

const Home = () => {
  return <DashboardClientOnly />;
};

export default Home;
