"use client";

import React, { useState, useEffect } from "react";
import AddToCartBtn from "./AddToCartBtn";
import styles from "../app/page.module.css";
import Link from "next/link";

interface ProductCardProps {
  product: any;
  categoryIcons?: any;
}

export default function ProductCard({ product, categoryIcons = {} }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images || [];
  const primaryImageIndex = images.findIndex((img: any) => img.is_primary);
  const defaultIndex = primaryImageIndex >= 0 ? primaryImageIndex : 0;
  
  const displayImageIndex = isHovered && images.length > 1 ? currentImageIndex : defaultIndex;

  const stock = Number(product.stock_quantity || 0);
  
  const catNorm = (product.category_name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const nameNorm = (product.name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  const isPreventa = catNorm.includes("preventa") || nameNorm.includes("preventa");
  const isProximoIngreso = catNorm.includes("proximo ingreso") || nameNorm.includes("proximo ingreso");
  const isExclusivo = catNorm.includes("exclusivo") || nameNorm.includes("exclusivo");
  const isOutOfStock = stock <= 0 && !isPreventa && !isProximoIngreso;

  // Calculate a realistic regular price for Old Navy comparison strike-through
  const basePrice = Number(product.base_price || 0);
  const regularPrice = basePrice > 0 ? (basePrice * 1.35).toFixed(2) : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setCurrentImageIndex(defaultIndex);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length, defaultIndex]);

  return (
    <div 
      className={styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className={`${styles.productImageWrapper} ${isOutOfStock ? styles.outOfStockWrapper : ""}`}>
        <Link href={`/producto/${product.sku}`} className={styles.imageLink}>
          {/* Status Badges */}
          <div className={styles.badgeContainer}>
            {isPreventa ? (
              <span className={`${styles.badge} ${styles.badgePreventa}`}>PREVENTA</span>
            ) : isProximoIngreso ? (
              <span className={`${styles.badge} ${styles.badgeProximo}`}>PRÓXIMO INGRESO</span>
            ) : isExclusivo ? (
              <span className={`${styles.badge} ${styles.badgeExclusivo}`}>ONLINE EXCLUSIVE</span>
            ) : isOutOfStock ? (
              <span className={`${styles.badge} ${styles.badgeAgotado}`}>AGOTADO</span>
            ) : (
              <span className={`${styles.badge} ${styles.badgeDeal}`}>OFERTA ESPECIAL</span>
            )}
          </div>
          
          {images.length > 0 ? (
            <div className={styles.imageSlider} style={{ transform: `translateX(-${displayImageIndex * 100}%)` }}>
              {images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.image_url}
                  alt={`${product.name} - Imagen ${idx + 1}`}
                  className={styles.productImg}
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <div className={styles.fallbackIcon}>
              {categoryIcons[product.category_name] || "👕"}
            </div>
          )}
        </Link>
      </div>

      {/* Color Swatch Dots Preview (Classic Old Navy Touch) */}
      <div className={styles.swatchRow}>
        <span className={styles.swatchDot} style={{ backgroundColor: "#002855" }} title="Navy Blue" />
        <span className={styles.swatchDot} style={{ backgroundColor: "#1e293b" }} title="Dark Heather" />
        <span className={styles.swatchDot} style={{ backgroundColor: "#c2410c" }} title="Warm Rust" />
        <span className={styles.swatchDot} style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1" }} title="Off White" />
      </div>
      
      {/* Product Info */}
      <div className={styles.productInfo}>
        <div className={styles.productBrand}>GOODTHINGS • {product.category_name || "COLECCIÓN"}</div>
        <Link href={`/producto/${product.sku}`} className={styles.titleLink}>
          <h3 className={styles.productName}>{product.name}</h3>
        </Link>
        
        {/* Pricing */}
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>Q{basePrice.toFixed(2)}</span>
          {regularPrice && (
            <span className={styles.regularPrice}>Q{regularPrice}</span>
          )}
        </div>

        {/* Stock / Availability Indicator */}
        <div className={styles.stockStatus}>
          {isPreventa ? (
            <span className={styles.statusPreorder}>⏳ Preventa Exclusiva</span>
          ) : isProximoIngreso ? (
            <span className={styles.statusProximo}>🚢 Próximo Ingreso</span>
          ) : isOutOfStock ? (
            <span className={styles.statusOut}>Agotado temporalmente</span>
          ) : stock <= 3 ? (
            <span className={styles.statusLow}>⚡ ¡Solo {stock} disponibles!</span>
          ) : (
            <span className={styles.statusAvailable}>✓ En Stock para envío</span>
          )}
        </div>

        {/* Add to Bag Button */}
        <div className={styles.btnContainer}>
          <AddToCartBtn 
            product={product} 
            primaryImage={images[defaultIndex]?.image_url || null} 
            isOutOfStock={isOutOfStock}
            isPreventa={isPreventa}
            isProximoIngreso={isProximoIngreso}
            isParentHovered={isHovered}
          />
        </div>
      </div>
    </div>
  );
}
