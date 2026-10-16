import styles from "./page.module.css";
import Link from "next/link";
import Header from "../components/Header";
import BrandsCarousel from "../components/BrandsCarousel";
import ProductCard from "../components/ProductCard";

interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  base_price: string;
  stock_quantity: number;
  brand: string;
  category_name: string;
  attributes: Record<string, string | number>;
  images: Array<{ id: number; image_url: string; is_primary: boolean; display_order: number }> | null;
  variants: Array<{ id: number; name: string; price_override: string | null; stock_quantity: number }> | null;
}

const API_URL = process.env.API_URL || "http://localhost:8080";

const categoryIcons: Record<string, string> = {
  "Hot Wheels": "🏎️",
  "Superhéroes": "🦸",
  "Coleccionables Exclusivos": "⭐",
};

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryFilter = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const brandFilter = typeof searchParams?.brand === "string" ? searchParams.brand : undefined;

  let products = await getProducts();

  if (categoryFilter) {
    const filterLower = categoryFilter.toLowerCase();
    products = products.filter(
      (p) => p.category_name?.toLowerCase() === filterLower
    );
  }

  if (brandFilter) {
    const brandLower = brandFilter.toLowerCase();
    products = products.filter(
      (p) => p.brand?.toLowerCase() === brandLower
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main>
        <div className={styles.heroWrapper}>
          <div className={styles.heroBg}></div>
          <BrandsCarousel />
          <section className={styles.hero}>
            <div className={`${styles.heroContent} animate-fade-in`}>
              <h1 className={styles.title}>
                El Universo del Coleccionismo
              </h1>
              <p className={styles.subtitle}>
                Encuentra las ediciones más exclusivas de Hot Wheels y las figuras de acción más detalladas de tus superhéroes favoritos.
              </p>
              <div className={styles.ctaGroup}>
                <Link href="/" className={styles.primaryBtn}>Explorar Catálogo</Link>
                <Link href="?category=Preventa" className={styles.secondaryBtn}>Preventa</Link>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>
            {brandFilter ? `Colección ${brandFilter}` : categoryFilter ? ` ${categoryFilter}` : "Nuevos Ingresos"}
          </h2>
          {products.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--foreground-muted)", padding: "2rem 0" }}>
              Por el momento no contamos con piezas disponibles en esta categoría. Nuestro inventario se actualiza constantemente, ¡vuelve pronto!
            </p>
          ) : (
            <div className={styles.productGrid}>

              {products.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryIcons={categoryIcons}
                  />
                );
              })}
            </div>
          )}
        </section>
        {/* VIP Banner */}
        <section className={styles.vipBanner}>
          <div className={styles.vipContent}>
            <h2>¡Únete a nuestro Canal VIP!</h2>
            <p>Escanea el código QR o haz clic en el botón para unirte a nuestro canal exclusivo de WhatsApp. Entérate antes que nadie de preventas, coleccionables exclusivos y ofertas especiales.</p>
            <a href="https://whatsapp.com/channel/0029VbDMEu1BvvsYrtveG61p" target="_blank" rel="noopener noreferrer" className={styles.vipBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Unirme al Canal
            </a>
          </div>
          <div className={styles.vipQr}>
            <img src="/canal_QR.jpeg" alt="WhatsApp Channel QR Code" />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeftSection}>
            <div className={styles.footerBrand}>
              <h3>TheBrosToys</h3>
              <p>Los Masters del Coleccionismo.</p>
            </div>
            <div className={styles.footerCategories}>
              <h4>Productos</h4>
              <ul>
                <li><Link href="/?category=Tecnología">Tecnología</Link></li>
                <li><Link href="/?category=Bootleg">Bootleg</Link></li>
                <li><Link href="/?category=Usados">Usados</Link></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerSocials}>
            <h4>Contáctanos</h4>
            <div className={styles.socialIcons}>
              <a href="https://wa.me/50239380000" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/brostoysgt" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Instagram
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} TheBrosToys. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/50239380000"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatingWhatsapp}
        aria-label="Chat on WhatsApp"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>
    </div>
  );
}
