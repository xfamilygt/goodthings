import { Metadata } from 'next';
import Header from "../../../components/Header";
import styles from "./producto.module.css";
import ImageGallery from "./ImageGallery";
import Link from "next/link";
import AddToCartBtn from "../../../components/AddToCartBtn";

import { mockGoodThingsProducts } from "../../../lib/mockProducts";

const API_URL = process.env.API_URL || "http://localhost:8080";

async function getProduct(sku: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/sku/${sku}`, {
      cache: "no-store"
    });
    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    console.error("Error in getProduct:", error);
  }

  // Fallback to mock GoodThings apparel
  const mockFound = mockGoodThingsProducts.find(p => p.sku === sku);
  return mockFound || null;
}

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.sku);
  if (!product) return { title: 'Not Found | GoodThings' };
  
  return {
    title: `${product.name} | GoodThings`,
    description: product.description || "GoodThings Colección",
    openGraph: {
      title: product.name,
      description: product.description || "GoodThings Colección",
      images: product.images?.[0]?.image_url ? [product.images[0].image_url] : [],
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.sku);

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ padding: '150px 2rem', textAlign: 'center', minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Producto no encontrado</h2>
          <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>Volver a la tienda</Link>
        </div>
      </>
    );
  }

  const stock = Number(product.stock_quantity || 0);
  const catNorm = (product.category_name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const nameNorm = (product.name || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  const isPreventa = catNorm.includes("preventa") || nameNorm.includes("preventa");
  const isProximoIngreso = catNorm.includes("proximo ingreso") || nameNorm.includes("proximo ingreso");
  const isOutOfStock = stock <= 0 && !isPreventa && !isProximoIngreso;
  const inStock = !isOutOfStock;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.productLayout}>
          {/* LEFT: Image Gallery (Client Component) */}
          <div className={styles.imageSection}>
            <ImageGallery images={product.images || []} fallbackName={product.name} />
          </div>

          {/* RIGHT: Product Info */}
          <div className={styles.infoSection}>
            <div className={styles.ageRating} style={{
              color: isPreventa ? '#3b82f6' : isProximoIngreso ? '#8b5cf6' : isOutOfStock ? '#ef4444' : stock <= 3 ? '#f59e0b' : '#10b981',
              borderColor: isPreventa ? '#3b82f6' : isProximoIngreso ? '#8b5cf6' : isOutOfStock ? '#ef4444' : stock <= 3 ? '#f59e0b' : '#10b981',
              backgroundColor: isPreventa ? 'rgba(59, 130, 246, 0.1)' : isProximoIngreso ? 'rgba(139, 92, 246, 0.1)' : isOutOfStock ? 'rgba(239, 68, 68, 0.1)' : stock <= 3 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'
            }}>
              {isPreventa ? '⏳ Preventa' : 
               isProximoIngreso ? '🚢 Próximo Ingreso' : 
               isOutOfStock ? '❌ Agotado' : 
               stock === 1 ? '🔥 ¡Última unidad!' : 
               stock <= 3 ? `⚡ ${stock} disponibles` : 
               stock > 5 ? '✓ +5 disponibles' : 
               `✓ ${stock} disponibles`}
            </div>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.sku}>SKU: {product.sku}</p>

            <div className={styles.price}>
              Q{parseFloat(product.base_price).toFixed(2)}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <AddToCartBtn 
                product={product} 
                primaryImage={product.images?.[0]?.image_url || null} 
                isOutOfStock={isOutOfStock}
                isPreventa={isPreventa}
                isProximoIngreso={isProximoIngreso}
              />
            </div>

            <div className={styles.accordionList}>
              <div className={styles.accordionItem}>
                <button className={styles.accordionHeader}>
                  <span>Product Features</span>
                  <span>+</span>
                </button>
                <div className={styles.accordionContent}>
                  {product.description || "No description available."}
                  {product.attributes && Object.keys(product.attributes).length > 0 && (
                    <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem' }}>
                      {Object.entries(product.attributes).map(([key, val]) => (
                        <li key={key}><strong>{key}:</strong> {String(val)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className={styles.accordionItem}>
                <button className={styles.accordionHeader}>
                  <span>Shipping Policy</span>
                  <span>+</span>
                </button>
              </div>
              <div className={styles.accordionItem}>
                <button className={styles.accordionHeader}>
                  <span>Return Policy</span>
                  <span>+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
