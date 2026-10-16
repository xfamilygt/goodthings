"use client";

import React, { useState, useEffect } from "react";
import AddToCartBtn from "./AddToCartBtn";
import styles from "../app/page.module.css";
import Link from "next/link";

interface ProductCardProps {
  product: any;
  categoryIcons: any;
}

export default function ProductCard({ product, categoryIcons }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images || [];
  const primaryImageIndex = images.findIndex((img: any) => img.is_primary);
  const defaultIndex = primaryImageIndex >= 0 ? primaryImageIndex : 0;
  
  // Use default image when not hovering, cycle when hovering
  const displayImageIndex = isHovered && images.length > 1 ? currentImageIndex : defaultIndex;
  const currentImage = images[displayImageIndex]?.image_url || null;

  const stock = Number(product.stock_quantity || 0);
  
  const catNorm = (product.category_name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const nameNorm = (product.name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  const isPreventa = catNorm.includes("preventa") || nameNorm.includes("preventa");
  const isProximoIngreso = catNorm.includes("proximo ingreso") || nameNorm.includes("proximo ingreso");
  const isExclusivo = catNorm.includes("exclusivo") || nameNorm.includes("exclusivo");
  const isOutOfStock = stock <= 0 && !isPreventa && !isProximoIngreso;

  let hoverClass = styles.hoverDefault;
  if (isPreventa) {
    hoverClass = styles.hoverPreventa;
  } else if (isExclusivo) {
    hoverClass = styles.hoverExclusive;
  } else if (stock > 1 || stock === 0) {
    hoverClass = styles.hoverBorderOnly;
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1000); // Cambia la imagen cada 1 segundo
    } else {
      setCurrentImageIndex(defaultIndex);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length, defaultIndex]);

  return (
    <div 
      className={`${styles.productCard} glass-panel ${hoverClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${styles.productImage} ${isOutOfStock ? styles.outOfStock : ""}`} style={{ padding: 0 }}>
        <Link href={`/producto/${product.sku}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          {isPreventa ? (
            <span className={styles.outOfStockSticker} style={{ background: '#3b82f6' }}>PREVENTA</span>
          ) : isProximoIngreso ? (
            <span className={styles.outOfStockSticker} style={{ background: '#8b5cf6' }}>PRÓXIMO INGRESO</span>
          ) : isOutOfStock ? (
            <span className={styles.outOfStockSticker}>AGOTADO</span>
          ) : null}
          
          {images.length > 0 ? (
            <div style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `translateX(-${displayImageIndex * 100}%)`
            }}>
              {images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.image_url}
                  alt={`${product.name} - Imagen ${idx + 1}`}
                  style={{ flexShrink: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ))}
            </div>
          ) : (
            categoryIcons[product.category_name] || "🧸"
          )}
        </Link>
      </div>
      
      <div className={styles.productInfo}>
        <Link href={`/producto/${product.sku}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className={styles.productCategory}>{product.category_name}</span>
          <h3 className={styles.productName}>{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '0.5rem' }}>
          
          {/* Lado Izquierdo: Botón */}
          <div style={{ flex: '1', marginRight: '0.8rem' }}>
            <AddToCartBtn 
              product={product} 
              primaryImage={images[defaultIndex]?.image_url || null} 
              isOutOfStock={isOutOfStock}
              isPreventa={isPreventa}
              isProximoIngreso={isProximoIngreso}
              isParentHovered={isHovered}
            />
          </div>

          {/* Lado Derecho: Precio y Disponibilidad */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
            <span className={styles.productPrice}>Q{Number(product.base_price).toFixed(2)}</span>
            
            {isPreventa ? (
              <span className={styles.stockStatusLow} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
                <span className={styles.desktopText}>⏳ Preventa</span>
                <span className={styles.mobileText}>⏳ Prev.</span>
              </span>
            ) : isProximoIngreso ? (
              <span className={styles.stockStatusLow} style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                <span className={styles.desktopText}>🚢 Próximo Ingreso</span>
                <span className={styles.mobileText}>🚢 Prox. Ingreso</span>
              </span>
            ) : isOutOfStock ? (
              <span className={styles.stockStatusOut}>
                ❌ Agotado
              </span>
            ) : stock === 1 ? (
              <span className={styles.stockStatusLow}>
                <span className={styles.desktopText}>🔥 ¡Última unidad!</span>
                <span className={styles.mobileText}>🔥 ¡Última!</span>
              </span>
            ) : stock <= 3 ? (
              <span className={styles.stockStatusLow}>
                <span className={styles.desktopText}>⚡ {stock} disponibles</span>
                <span className={styles.mobileText}>⚡ {stock} disp.</span>
              </span>
            ) : stock > 5 ? (
              <span className={styles.stockStatusAvailable}>
                <span className={styles.desktopText}>✓ +5 disponibles</span>
                <span className={styles.mobileText}>✓ +5 disp.</span>
              </span>
            ) : (
              <span className={styles.stockStatusAvailable}>
                <span className={styles.desktopText}>✓ {stock} disponibles</span>
                <span className={styles.mobileText}>✓ {stock} disp.</span>
              </span>
            )}

            {product.variants && product.variants.length > 0 && (
              <span className={styles.variantCount}>
                {product.variants.length} var.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
