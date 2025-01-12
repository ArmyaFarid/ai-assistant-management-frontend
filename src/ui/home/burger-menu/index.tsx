"use client";
import React, {useEffect, useRef, useState} from "react";

import './style.css';
import {FaTimes} from "react-icons/fa";
import {MenuLink} from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

type BurgerSideBarProps={
    menuItems: MenuLink[];
    children: React.ReactNode; // Content of the button
}

const BurgerSidebar: React.FC<BurgerSideBarProps> = ({menuItems, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    const sidebarRef = useRef<HTMLDivElement | null>(null); // Set the type explicitly


    useEffect(() => {
        const closeSidebar = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                console.log("clik");
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", closeSidebar,true);

        return () => {
            document.removeEventListener("mousedown", closeSidebar,true);
        };
    }, [sidebarRef]);

    const toggleMenu = () => {
        console.log("toogle");
        setIsOpen(!isOpen);
    };
    return (
        <>
            <div className="burger-toggle" onClick={toggleMenu} style={{cursor:"pointer"}}>
                {children || (
                    /* Display default button if no children provided */
                    <div className="burger-icon">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                )}
            </div>
            <div ref={sidebarRef} className={`burger-sidebar bg-primary ${isOpen ? "open" : "closed"}`}>
                <div className="close-button" onClick={toggleMenu} style={{cursor:"pointer"}}>
                    {/* Close button (you can replace this with your custom icon) */}
                    {/*<button>&times;</button>*/}
                    <FaTimes className="text-white"/>
                </div>

                <ul className="menu-item-list mt-[50px]">
                    {menuItems.map((item, index) => (
                        <li key={index} className="menu-item text-white font-bold text-lg">
                            <Link href={item.href}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default BurgerSidebar;
