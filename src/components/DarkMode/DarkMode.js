import React, { useState, useEffect } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {
    const [userDarkMode, setUserDarkMode] = useState(
        parseInt(localStorage.getItem("userDarkMode")) || 0
    );

    const setDarkMode = () => {
        localStorage.setItem("userDarkMode", 1);
        document.querySelector("body").setAttribute("data-theme", "dark");
        setUserDarkMode(1);
    };

    const setLightMode = () => {
        localStorage.setItem("userDarkMode", 0);
        document.querySelector("body").setAttribute("data-theme", "light");
        setUserDarkMode(0);
    };

    const toggleTheme = (e) => {
        if (e.target.checked) {
            setDarkMode();
        } else {
            setLightMode();
        }
    };

    useEffect(() => {
        if (userDarkMode) {
            setDarkMode();
        } else {
            setLightMode();
        }
    }, [userDarkMode]);

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                checked={!!userDarkMode}
                onChange={toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
