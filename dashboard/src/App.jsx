import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JsonFile from "./pages/JsonFile";
import Mongo from "./pages/Mongo";
import Dashboard from "./pages/Dashboard";
import DashboardAlt from "./pages/DashboardAlt";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboardalt" element={<DashboardAlt />} />
                <Route path="/jsonfile" element={<JsonFile />} />
                <Route path="/mongo" element={<Mongo />} />
            </Routes>
        </BrowserRouter>
    );
}
