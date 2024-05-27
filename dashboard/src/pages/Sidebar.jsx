import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Home, PersonAddAlt1, ViewList } from "@mui/icons-material";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();

        localStorage.removeItem("id");

        navigate("/");
    };

    const LinkOrText = localStorage.getItem("id") ? "div" : Link;

    return (
        <div className="sidebar">
            <div className="items">

                <LinkOrText to="/dashboard">
                    <div className="item">
                        <Home />
                        <p>HOME</p>
                    </div>
                </LinkOrText>

                <LinkOrText to="/jsonfile">
                    <div className="tilecontent">
                        <Home />
                        <p>JSON FILE</p>
                    </div>
                </LinkOrText>

                <LinkOrText to="/mongo">
                    <div className="tilecontent">
                        <Home />
                        <p>MONGO</p>
                    </div>
                </LinkOrText>

            </div>
        </div>
    );
}
