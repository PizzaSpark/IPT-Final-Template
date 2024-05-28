import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Manage from "./pages/Manage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Manage />} />
            </Routes>
        </BrowserRouter>
    );
}
