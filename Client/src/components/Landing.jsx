import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.webp';
import "../styles/Landing.css";

const Landing = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.pageYOffset > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div id="Landing">
            <header className={`navbar-header ${isScrolled ? "navbar-sticky" : ""}`} id='nav-menu'>
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="Swanirbhar" />
                </Link>
                <Button className='secure-btn' onClick={() => navigate("/login")}>Sign In</Button>
            </header>
        </div>
    );
}

export default Landing;
