/** @format */

import React from "react";
import Home from "../modules/Home/Home";
import Countdown from "../modules/Countdown/Countdown";
import Sidebar from "../library/common/components/Sidebar";
import routeNameToRouteMap from "../library/common/constants/routeNames";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Feeds = () => <h2>Feeds Page</h2>;
const Tabs = () => <h2>Tabs Page</h2>;

const routeConfig = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path={routeNameToRouteMap.HOME} element={<Home />} />
            <Route
              path={routeNameToRouteMap.COUNTDOWN}
              element={<Countdown {...{ targetTime: Date.now() + 3600000 }} />}
            />
            <Route path={routeNameToRouteMap.FEEDS} element={<Feeds />} />
            <Route path={routeNameToRouteMap.TABS} element={<Tabs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default routeConfig;
