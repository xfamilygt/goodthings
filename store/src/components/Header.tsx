"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { TheBrosToysLogo } from "./TheBrosToysLogo";
import styles from "../app/page.module.css";
import headerStyles from "./Header.module.css";

export default function Header() {
  const { cartCount, toggleCart } = useCart();

  return (
    <header className={`${styles.header} ${headerStyles.stickyHeader}`}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <TheBrosToysLogo />
      </Link>

      {/* Search Bar */}
      <div className={headerStyles.searchContainer}>
        <svg className={headerStyles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Search Store" className={headerStyles.searchInput} />
      </div>

      {/* Right Navigation */}
      <div className={headerStyles.rightNav}>
        <div className={headerStyles.linksContainer}>
          <Link href="?category=Preventa" className={headerStyles.linkPreorders}>
            <svg className={headerStyles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            PRE-ORDERS
          </Link>
          
          <span className={headerStyles.divider}>|</span>
          
          <Link href="?category=Coleccionables Exclusivos" className={headerStyles.linkBold}>
            EXCLUSIVOS
          </Link>

          <span className={headerStyles.divider}>|</span>

          <Link href="?category=Kids" className={headerStyles.linkBold}>
            KIDS
          </Link>
        </div>

        {/* User Login */}
        <button className={headerStyles.iconBtn} aria-label="Login">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Cart (Borderless) */}
        <button className={headerStyles.cartBtn} onClick={toggleCart} aria-label="Ver carrito">
          <div className={headerStyles.cartContainer}>
            <svg className={headerStyles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className={headerStyles.cartCount}>
              ({cartCount})
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
