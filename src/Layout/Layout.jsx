import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from "react-router-dom"
import "./css/layout.css"
const Layout = () => {
    return (
        <div className='layout'>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
}

export default Layout;
