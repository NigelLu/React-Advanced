/** @format */

import "./Sidebar.css";
import React from "react";
import { Link } from "react-router-dom";
import routeNameToRouteMap from "../constants/routeNames";

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul>
        <li>
          <Link to={routeNameToRouteMap.HOME}>Home</Link>
        </li>
        <li>
          <Link to={routeNameToRouteMap.COUNTDOWN}>Count Down</Link>
        </li>
        <li>
          <Link to={routeNameToRouteMap.FEEDS}>Feeds (Infinite Scrolling)</Link>
        </li>
        <li>
          <Link to={routeNameToRouteMap.TABS}>Tabs (with Caching)</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
