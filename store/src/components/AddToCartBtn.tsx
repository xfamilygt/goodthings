"use client";

import React from "react";
import { useCart } from "./CartContext";
import styles from "./AddToCartBtn.module.css";

interface AddToCartBtnProps {
  product: {
    id: number;
    name: string;
    base_price: string;
    stock_quantity: number;
  };
  primaryImage: string | null;
  isOutOfStock: boolean;
  isPreventa: boolean;
  isProximoIngreso: boolean;
  isParentHovered?: boolean;
}

export default function AddToCartBtn({ product, primaryImage, isOutOfStock, isPreventa, isProximoIngreso, isParentHovered = false }: AddToCartBtnProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.base_price),
      quantity: 1,
      image: primaryImage || "",
      // For preventa/proximo ingreso, we can just allow them to order up to a theoretical limit (e.g. 10) since stock might be 0
      stock_quantity: (isPreventa || isProximoIngreso) ? 10 : Number(product.stock_quantity || 0),
    });
  };

  let btnTextDesktop = "Agregar a Carrito";
  let btnTextMobile = "Agregar";
  if (isPreventa) {
    btnTextDesktop = "Reservar Preventa";
    btnTextMobile = "Reservar";
  }
  if (isProximoIngreso) {
    btnTextDesktop = "Reservar Ingreso";
    btnTextMobile = "Reservar";
  }

  return (
    <button 
      className={`${styles.addBtn} ${isOutOfStock ? styles.disabled : ""} ${isParentHovered ? styles.hoveredBtn : ""}`} 
      disabled={isOutOfStock}
      onClick={handleAdd}
    >
      <span className={styles.btnIcon}>+</span>
      {isOutOfStock ? (
        <span>Agotado</span>
      ) : (
        <>
          <span className={styles.desktopText}>{btnTextDesktop}</span>
          <span className={styles.mobileText}>{btnTextMobile}</span>
        </>
      )}
    </button>
  );
}
