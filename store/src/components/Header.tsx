"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { GoodThingsLogo } from "./GoodThingsLogo";
import styles from "./Header.module.css";

const navCategories = [
  { name: "Novedades & Tendencias", query: "Novedades" },
  { name: "Mujer", query: "Mujer" },
  { name: "Hombre", query: "Hombre" },
  { name: "Niños & Niñas", query: "Kids" },
  { name: "Bebés", query: "Bebes" },
  { name: "Pijamas & Familia", query: "Pijamas" },
  { name: "Suéteres & Abrigos", query: "Suéteres" },
  { name: "Jeans & Denim", query: "Jeans" },
  { name: "Accesorios", query: "Salud" },
  { name: "Liquidación", query: "Clearance", isSale: true },
];

export default function Header() {
  const { cartCount, toggleCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className={styles.headerWrapper}>
      {/* 1. TOP NAVY BRAND / UTILITY BAR */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          {/* Brand tabs */}
          <div className={styles.brandTabs}>
            <Link href="/" className={`${styles.brandTab} ${styles.brandTabActive}`}>
              GOODTHINGS
            </Link>
            <Link href="/?category=Salud" className={styles.brandTab}>
              SALUD
            </Link>
            <Link href="/?category=Bebes" className={styles.brandTab}>
              BEBÉS
            </Link>
            <Link href="/?category=Clearance" className={styles.brandTab}>
              OUTLET
            </Link>
          </div>

          {/* Center Promo Message */}
          <div className={styles.topNotice}>
            <span>Envío <strong>GRATIS</strong> en compras de Q350+ para miembros</span>
            <span className={styles.topNoticeDivider}>•</span>
            <Link href="#rewards" className={styles.topNoticeLink}>Únete al Club</Link>
          </div>

          {/* Right Utility Links */}
          <div className={styles.topUtilities}>
            <Link href="#tiendas" className={styles.topUtilLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Tiendas</span>
            </Link>

            <span className={styles.topUtilDivider}>|</span>

            <div className={styles.topUtilLink}>
              <span className={styles.flagIcon}>🇬🇹</span>
              <span>GT / GTQ</span>
            </div>

            <span className={styles.topUtilDivider}>|</span>

            <Link href="#cuenta" className={styles.topUtilLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Mi Cuenta</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN WHITE NAVIGATION ROW */}
      <div className={styles.mainNav}>
        <div className={styles.mainNavContainer}>
          {/* Brand Logo */}
          <Link href="/" className={styles.logoLink} aria-label="GoodThings Inicio">
            <GoodThingsLogo size="md" />
          </Link>

          {/* Search Pill Bar */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchBar}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="¿Qué estás buscando hoy? (Jeans, suéteres, chamarras...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} className={styles.clearSearchBtn} aria-label="Limpiar búsqueda">
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Right Action Icons (Old Navy Style) */}
          <div className={styles.actionsGroup}>
            {/* Rewards */}
            <Link href="#rewards" className={styles.actionItem} title="GoodThings Rewards">
              <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className={styles.actionLabel}>Rewards</span>
            </Link>

            {/* Favorites */}
            <Link href="#favoritos" className={styles.actionItem} title="Favoritos">
              <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className={styles.actionLabel}>Favoritos</span>
            </Link>

            {/* Shopping Bag / Cart */}
            <button className={styles.cartButton} onClick={toggleCart} aria-label="Abrir Bolsa de compras">
              <div className={styles.cartIconWrapper}>
                <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartCount > 0 && (
                  <span className={styles.cartCountBadge}>{cartCount}</span>
                )}
              </div>
              <span className={styles.actionLabel}>Bolsa ({cartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY BAR (DEPARTMENTS) */}
      <nav className={styles.categoryNav} aria-label="Departamentos">
        <div className={styles.categoryNavContainer}>
          <ul className={styles.categoryList}>
            {navCategories.map((cat, idx) => (
              <li key={idx} className={styles.categoryItem}>
                <Link
                  href={`/?category=${encodeURIComponent(cat.query)}`}
                  className={`${styles.categoryLink} ${cat.isSale ? styles.saleCategoryLink : ""}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
