"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert("Por favor ingresa tu nombre y apellido para el pedido.");
      return;
    }

    setIsSubmitting(true);
    try {
      const items = cartItems.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
        price: item.price
      }));

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          total: cartTotal,
          items: items
        })
      });

      if (!res.ok) {
        throw new Error("Error al crear la orden");
      }

      const order = await res.json();

      const phoneNumber = "50239380000";

      let message = `Hola, me gustaría confirmar mi pedido.\n`;
      message += `*Número de Orden:* ${order.order_number}\n\n`;
      message += `*Detalle:*\n`;
      cartItems.forEach(item => {
        message += `- ${item.quantity}x ${item.name} (Q${(item.price * item.quantity).toFixed(2)})\n`;
      });
      message += `\n*Total:* Q${cartTotal.toFixed(2)}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      clearCart();
      toggleCart();
      setCustomerName("");

      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error(error);
      alert("Hubo un problema al crear la orden. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={toggleCart} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>{cartCount} Artículo{cartCount !== 1 ? 's' : ''} en tu Carrito</h2>
          <button className={styles.closeBtn} onClick={toggleCart}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Tu carrito está vacío.</p>
            <button className={styles.continueBtn} onClick={toggleCart}>Continuar Comprando</button>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className={styles.imagePlaceholder}>🧸</div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    {item.variantName && (
                      <p className={styles.itemVariant}>Variante: {item.variantName}</p>
                    )}
                    <div className={styles.itemActions}>
                      <button onClick={() => removeFromCart(item.id)} className={styles.deleteBtn}>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className={styles.itemControls}>
                    <select
                      className={styles.qtySelect}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    >
                      {[...Array(Math.min(item.stock_quantity, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.itemPricing}>
                    <div className={styles.priceCol}>
                      <span className={styles.priceLabel}>Precio</span>
                      <span className={styles.priceValue}>Q{item.price.toFixed(2)}</span>
                    </div>
                    <div className={styles.priceCol}>
                      <span className={styles.priceLabel}>Subtotal</span>
                      <span className={styles.subtotalValue}>Q{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.checkoutForm}>
                <label htmlFor="customerName">Nombre y Apellido</label>
                <input
                  id="customerName"
                  type="text"
                  className={styles.checkoutInput}
                  placeholder="Ej. Juan Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.totalRow}>
                <span>Total Estimado:</span>
                <span className={styles.totalAmount}>Q{cartTotal.toFixed(2)}</span>
              </div>
              <button
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={isSubmitting || !customerName.trim()}
              >
                {isSubmitting ? "Procesando..." : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Confirmar Pedido en WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
