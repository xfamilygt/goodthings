import styles from "./page.module.css";
import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

import { mockGoodThingsProducts, Product } from "../lib/mockProducts";

const API_URL = process.env.API_URL || "http://localhost:8080";

const categoryIcons: Record<string, string> = {
  "Ropa": "👕",
  "Jeans": "👖",
  "Suéteres": "🧥",
  "Suéteres & Abrigos": "🧥",
  "Hombre": "👔",
  "Mujer": "👗",
  "Bebes": "👶",
  "Salud": "🧣",
  "Pijamas": "✨",
};

// Fall Must-Haves categories matching Old Navy's row
const fallMustHaves = [
  { name: "Puffers", image: "/images/cat_puffer.jpg", query: "Puffers" },
  { name: "Hoodies", image: "/images/cat_hoodie.jpg", query: "Hoodies" },
  { name: "Jeans", image: "/images/cat_jeans.jpg", query: "Jeans" },
  { name: "Tops", image: "/images/cat_sweater.jpg", query: "Tops" },
  { name: "Flannels", image: "/images/cat_flannel.jpg", query: "Flannels" },
  { name: "Sweaters", image: "/images/sweater_weather.jpg", query: "Suéteres" },
  { name: "Joggers", image: "/images/cat_pants.jpg", query: "Pants" },
  { name: "Fleece", image: "/images/softest_sweats.jpg", query: "Fleece" },
];

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data: Product[] = await res.json();
      // Si ya existen productos cargados con marca GoodThings o ropa en la BD, los usa
      const goodThingsItems = data.filter(
        (p) =>
          p.brand?.toLowerCase() === "goodthings" ||
          p.category_name?.toLowerCase().includes("ropa") ||
          p.category_name?.toLowerCase().includes("mujer") ||
          p.category_name?.toLowerCase().includes("hombre") ||
          p.category_name?.toLowerCase().includes("bebe") ||
          p.category_name?.toLowerCase().includes("salud") ||
          p.category_name?.toLowerCase().includes("pijama") ||
          p.category_name?.toLowerCase().includes("jean") ||
          p.category_name?.toLowerCase().includes("sueter")
      );
      if (goodThingsItems.length > 0) {
        return goodThingsItems;
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  // Por defecto, usa el catálogo mock de GoodThings con prendas de vestir
  return mockGoodThingsProducts;
}

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryFilter = typeof searchParams?.category === "string" ? searchParams.category : undefined;
  const brandFilter = typeof searchParams?.brand === "string" ? searchParams.brand : undefined;
  const searchFilter = typeof searchParams?.search === "string" ? searchParams.search : undefined;
  const tabFilter = typeof searchParams?.tab === "string" ? searchParams.tab : undefined;

  let products = await getProducts();

  if (categoryFilter) {
    const filterLower = categoryFilter.toLowerCase();
    products = products.filter(
      (p) =>
        p.category_name?.toLowerCase().includes(filterLower) ||
        p.name?.toLowerCase().includes(filterLower) ||
        (filterLower === "puffers" && p.name.toLowerCase().includes("puffer")) ||
        (filterLower === "hoodies" && (p.name.toLowerCase().includes("hoodie") || p.name.toLowerCase().includes("sudadera"))) ||
        (filterLower === "flannels" && (p.name.toLowerCase().includes("flannel") || p.name.toLowerCase().includes("franela"))) ||
        (filterLower === "tops" && (p.name.toLowerCase().includes("camisa") || p.name.toLowerCase().includes("crewneck") || p.name.toLowerCase().includes("suéter"))) ||
        (filterLower === "pants" && (p.name.toLowerCase().includes("pantalón") || p.name.toLowerCase().includes("chino"))) ||
        (filterLower === "fleece" && (p.name.toLowerCase().includes("fleece") || p.description.toLowerCase().includes("fleece"))) ||
        (filterLower === "kids" && (p.name.toLowerCase().includes("infantil") || p.description.toLowerCase().includes("niños") || p.attributes?.["Familia"]?.toString().includes("Niños")))
    );
  }

  if (brandFilter) {
    const brandLower = brandFilter.toLowerCase();
    products = products.filter(
      (p) => p.brand?.toLowerCase() === brandLower
    );
  }

  if (searchFilter) {
    const searchLower = searchFilter.toLowerCase();
    products = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.category_name?.toLowerCase().includes(searchLower)
    );
  }

  if (tabFilter === "bestsellers") {
    // Ordenar por popularidad / inventario
    products = [...products].sort((a, b) => b.stock_quantity - a.stock_quantity);
  } else if (tabFilter === "newarrivals") {
    // Invertir para mostrar los últimos
    products = [...products].reverse();
  }

  const isFiltered = Boolean(categoryFilter || brandFilter || searchFilter);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <Header />

      <main className={styles.mainContent}>
        {/* 1. TOP PROMO RIBBON (GIFTOBER / 50% OFF) */}
        <section className={styles.topPromoRibbon} aria-label="Promoción Especial">
          <div className={styles.ribbonContent}>
            <div className={styles.ribbonBadgeLeft}>
              <span className={styles.starburstSmall}>✦</span>
              <span className={styles.ribbonTag}>LIMITED TIME ONLY</span>
            </div>
            
            <div className={styles.ribbonCenter}>
              <h2 className={styles.ribbonTitle}>50% Off Early Giftober Deals</h2>
              <p className={styles.ribbonSubtitle}>Válido en estilos seleccionados • Compras en tienda y en línea</p>
            </div>

            <div className={styles.ribbonBadgeRight}>
              <span className={styles.starburstSmall}>✦</span>
              <span className={styles.ribbonTag}>SPECIAL OFFERS</span>
            </div>
          </div>
        </section>

        {/* If filtered, show filter banner; otherwise show complete Old Navy editorial layout */}
        {isFiltered ? (
          <div className={styles.filteredHeaderSection}>
            <h1 className={styles.filteredTitle}>
              {brandFilter ? `Colección: ${brandFilter}` : categoryFilter ? `Categoría: ${categoryFilter}` : `Resultados para: "${searchFilter}"`}
            </h1>
            <p className={styles.filteredSubtitle}>
              Mostrando {products.length} producto{products.length !== 1 ? 's' : ''} disponibles
            </p>
            <Link href="/" className={styles.clearFilterLink}>
              ← Ver toda la tienda
            </Link>
          </div>
        ) : (
          <>
            {/* 2. HERO BANNER: JINGLE JAMMIES ARE SO BACK */}
            <section className={styles.heroSection}>
              <div className={styles.heroBanner}>
                <div className={styles.heroImageWrapper}>
                  <img
                    src="/images/hero_pajamas.jpg"
                    alt="Familia en pijamas navideñas GoodThings"
                    className={styles.heroImg}
                  />
                  <div className={styles.heroOverlayGradient} />
                </div>

                <div className={styles.heroContent}>
                  <span className={styles.heroBrandCallout}>GOODTHINGS SPECIALS</span>
                  <h1 className={styles.heroTitle}>Jingle Jammies Are So Back</h1>
                  <p className={styles.heroSubtitle}>
                    The softest sets for the whole family
                  </p>
                  
                  <div className={styles.heroBtnGroup}>
                    <Link href="/?category=Pijamas" className="btn-pill-white">
                      SHOP MATCHING PAJAMAS
                    </Link>
                    <Link href="/?category=Familia" className="btn-pill-outline">
                      SHOP ALL PAJAMAS
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. "MORE FALL MUST HAVES" CIRCULAR / ROUNDED CATEGORY ROW */}
            <section className={styles.mustHavesSection}>
              <div className={styles.sectionHeaderCentered}>
                <h2 className={styles.mustHavesTitle}>More Fall Must Haves</h2>
              </div>

              <div className={styles.mustHavesGrid}>
                {fallMustHaves.map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/?category=${encodeURIComponent(item.query)}`}
                    className={styles.mustHaveCard}
                  >
                    <div className={styles.mustHaveImageContainer}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.mustHaveImg}
                        loading="lazy"
                      />
                    </div>
                    <span className={styles.mustHaveLabel}>{item.name}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 4. TWO-COLUMN EDITORIAL GRID: SWEATERS & STOCKING STUFFERS */}
            <section className={styles.twoColSection}>
              {/* Left Editorial: Best in Sweater Weather */}
              <div className={styles.editorialCard}>
                <div className={styles.editorialImageWrapper}>
                  <img
                    src="/images/sweater_weather.jpg"
                    alt="Best in Sweater Weather"
                    className={styles.editorialImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.editorialContent}>
                  <h3 className={styles.editorialTitle}>BEST IN SWEATER WEATHER</h3>
                  <p className={styles.editorialDesc}>So soft, you have to feel it to believe it</p>
                  <Link href="/?category=Suéteres" className={styles.editorialLink}>
                    SHOP SWEATERS
                  </Link>
                </div>
              </div>

              {/* Right Editorial: Stocking Stuffer Central with Starburst Badge */}
              <div className={styles.editorialCard}>
                <div className={styles.editorialImageWrapper}>
                  <img
                    src="/images/snowman_gifts.jpg"
                    alt="Stocking Stuffer Central"
                    className={styles.editorialImg}
                    loading="lazy"
                  />
                  {/* Starburst Badge from Old Navy */}
                  <div className={styles.starburstBadge}>
                    <div className={styles.starburstInner}>
                      <span>More Merry</span>
                      <strong>For Your</strong>
                      <span>Money</span>
                    </div>
                  </div>
                </div>
                <div className={styles.editorialContent}>
                  <h3 className={styles.editorialTitle}>STOCKING STUFFER CENTRAL</h3>
                  <p className={styles.editorialDesc}>Hats, scarves & more accessories starting at $6</p>
                  <Link href="/?category=Accesorios" className={styles.editorialLink}>
                    SHOP GIFTS
                  </Link>
                </div>
              </div>
            </section>

            {/* 5. WIDE HORIZONTAL EDITORIAL: FIT FOR FALL */}
            <section className={styles.fitForFallSection}>
              <div className={styles.fitForFallContainer}>
                <div className={styles.fitForFallImageWrapper}>
                  <img
                    src="/images/fit_for_fall.jpg"
                    alt="Fit For Fall Jeans Collection"
                    className={styles.fitForFallImg}
                    loading="lazy"
                  />
                  <div className={styles.fitForFallBadge}>
                    <span className={styles.badgeLabel}>JEANS FROM</span>
                    <strong className={styles.badgePrice}>$26</strong>
                  </div>
                </div>

                <div className={styles.fitForFallOverlay}>
                  <h2 className={styles.fitForFallTitle}>Fit For Fall</h2>
                  <p className={styles.fitForFallSubtitle}>
                    Building modern everyday silhouettes around classic, authentic denim.
                  </p>
                  <div className={styles.fitForFallBtns}>
                    <Link href="/?category=Jeans" className="btn-pill-navy">
                      SHOP WOMEN&apos;S JEANS
                    </Link>
                    <Link href="/?category=Jeans" className="btn-pill-navy">
                      SHOP MEN&apos;S JEANS
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. HIGH-IMPACT CLEARANCE PROMO STRIP */}
            <section className={styles.clearanceBanner} aria-label="Liquidación">
              <div className={styles.clearanceContent}>
                <h2 className={styles.clearanceText}>CLEARANCE FROM $3.99</h2>
                <Link href="/?category=Clearance" className={styles.clearancePillBtn}>
                  SHOP NOW
                </Link>
              </div>
            </section>

            {/* 7. TWO-COLUMN TREND EDITORIAL: CAMPUS COOL & SOFTEST SWEATS */}
            <section className={styles.twoColSection}>
              {/* Left Editorial: Campus Cool for Men */}
              <div className={styles.editorialCard}>
                <div className={styles.editorialImageWrapper}>
                  <img
                    src="/images/campus_cool.jpg"
                    alt="Campus Cool For Men"
                    className={styles.editorialImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.editorialContent}>
                  <h3 className={styles.editorialTitle}>CAMPUS COOL FOR MEN</h3>
                  <p className={styles.editorialDesc}>The freshest layers for class & beyond</p>
                  <Link href="/?category=Hombre" className={styles.editorialLink}>
                    SHOP NOW
                  </Link>
                </div>
              </div>

              {/* Right Editorial: The Softest Sweats */}
              <div className={styles.editorialCard}>
                <div className={styles.editorialImageWrapper}>
                  <img
                    src="/images/softest_sweats.jpg"
                    alt="The Softest Sweats"
                    className={styles.editorialImg}
                    loading="lazy"
                  />
                  <div className={styles.sweatsBadge}>
                    <span>Sweats from</span>
                    <strong>$19</strong>
                  </div>
                </div>
                <div className={styles.editorialContent}>
                  <h3 className={styles.editorialTitle}>THE SOFTEST SWEATS</h3>
                  <p className={styles.editorialDesc}>Fleece so good you&apos;ll never take it off</p>
                  <Link href="/?category=Hoodies" className={styles.editorialLink}>
                    SHOP FLEECE
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 8. CURATED PRODUCT SECTION ("WE PICKED THESE JUST FOR YOU...") */}
        <section className={styles.productCatalogSection}>
          <div className={styles.catalogHeader}>
            <h2 className={styles.catalogTitle}>WE PICKED THESE JUST FOR YOU...</h2>
            
            <div className={styles.catalogTabs}>
              <Link href="/" className={`${styles.catalogTab} ${!tabFilter && !categoryFilter ? styles.catalogTabActive : ''}`}>
                RECOMMENDED
              </Link>
              <Link href="/?tab=bestsellers" className={`${styles.catalogTab} ${tabFilter === 'bestsellers' ? styles.catalogTabActive : ''}`}>
                BEST SELLERS
              </Link>
              <Link href="/?tab=newarrivals" className={`${styles.catalogTab} ${tabFilter === 'newarrivals' ? styles.catalogTabActive : ''}`}>
                NEW ARRIVALS
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className={styles.emptyProducts}>
              <p>Por el momento no contamos con piezas disponibles en esta categoría.</p>
              <Link href="/" className="btn-pill-navy" style={{ marginTop: "1rem" }}>
                Ver Todos los Productos
              </Link>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryIcons={categoryIcons}
                />
              ))}
            </div>
          )}
        </section>

        {/* 9. "CHECK OUT OUR NEWEST ARRIVALS" DEPARTMENT STRIP */}
        <section className={styles.departmentsStrip}>
          <h3 className={styles.departmentsTitle}>CHECK OUT OUR NEWEST ARRIVALS</h3>
          <div className={styles.departmentsList}>
            <Link href="/?category=Mujer" className={styles.deptLink}>WOMEN</Link>
            <span className={styles.deptDot}>•</span>
            <Link href="/?category=Hombre" className={styles.deptLink}>MEN</Link>
            <span className={styles.deptDot}>•</span>
            <Link href="/?category=Kids" className={styles.deptLink}>GIRLS</Link>
            <span className={styles.deptDot}>•</span>
            <Link href="/?category=Kids" className={styles.deptLink}>BOYS</Link>
            <span className={styles.deptDot}>•</span>
            <Link href="/?category=Bebes" className={styles.deptLink}>TODDLER & BABY</Link>
            <span className={styles.deptDot}>•</span>
            <Link href="/?category=Jeans" className={styles.deptLink}>JEANS</Link>
            <span className={styles.deptDot}>•</span>
            <Link href="/?category=Clearance" className={`${styles.deptLink} ${styles.deptLinkSale}`}>CLEARANCE</Link>
          </div>
        </section>

        {/* 10. MARKETING SIGN-UP & REWARDS BAR (3 COLUMNS) */}
        <section className={styles.marketingSignupSection}>
          <div className={styles.marketingContainer}>
            {/* Col 1: Email */}
            <div className={styles.marketingCard}>
              <div className={styles.marketingIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h4 className={styles.marketingHeading}>Sign up for email</h4>
              <p className={styles.marketingText}>Get 20% off your next purchase and early deal alerts.</p>
              <form className={styles.signupForm} action="#">
                <input type="email" placeholder="Ingresa tu correo" className={styles.signupInput} />
                <button type="submit" className={styles.signupBtn}>JOIN</button>
              </form>
            </div>

            {/* Col 2: Text Alerts */}
            <div className={styles.marketingCard}>
              <div className={styles.marketingIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
              <h4 className={styles.marketingHeading}>Sign up for text</h4>
              <p className={styles.marketingText}>Exclusive flash sales and promo codes directly to your phone.</p>
              <form className={styles.signupForm} action="#">
                <input type="tel" placeholder="Número de teléfono" className={styles.signupInput} />
                <button type="submit" className={styles.signupBtn}>JOIN</button>
              </form>
            </div>

            {/* Col 3: GoodThings Rewards Card */}
            <div className={styles.marketingCard}>
              <div className={styles.marketingIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h4 className={styles.marketingHeading}>GoodThings Rewards Card</h4>
              <p className={styles.marketingText}>Earn 5x points on every purchase and unlock member perks.</p>
              <div className={styles.rewardsLinks}>
                <Link href="#apply" className={styles.rewardsAction}>Apply Now</Link>
                <span className={styles.rewardsDivider}>|</span>
                <Link href="#learn" className={styles.rewardsAction}>Learn More</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER (OLD NAVY 4-COLUMN FORMAT) */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            {/* Column 1: Customer Support */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Customer Support</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="#help">Help & Contact</Link></li>
                <li><Link href="#track">Track Your Order</Link></li>
                <li><Link href="#shipping">Shipping & Delivery</Link></li>
                <li><Link href="#returns">Returns & Exchanges</Link></li>
                <li><Link href="#size">Size Chart & Guides</Link></li>
              </ul>
            </div>

            {/* Column 2: GoodThings Rewards */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>GoodThings Rewards</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="#benefits">Club Benefits</Link></li>
                <li><Link href="#points">Check Points Balance</Link></li>
                <li><Link href="#pay">Pay Your Bill</Link></li>
                <li><Link href="#terms">Rewards Terms</Link></li>
              </ul>
            </div>

            {/* Column 3: About GoodThings */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>About Us</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="#story">Our Story</Link></li>
                <li><Link href="#sustainability">Sustainability</Link></li>
                <li><Link href="#careers">Careers</Link></li>
                <li><Link href="#stores">Store Locations</Link></li>
              </ul>
            </div>

            {/* Column 4: Follow Us & Social */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Follow Us</h4>
              <p className={styles.footerSocialDesc}>Stay connected with GoodThings for fresh deals and new drops.</p>
              <div className={styles.socialIconsRow}>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* Twitter / X */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/50239380000" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottomBar}>
            <p className={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} GoodThings Inc. Todos los derechos reservados.
            </p>
            <div className={styles.footerLegalLinks}>
              <Link href="#privacy">Privacy Policy</Link>
              <span>|</span>
              <Link href="#terms">Terms of Use</Link>
              <span>|</span>
              <Link href="#accessibility">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/50239380000"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatingWhatsapp}
        aria-label="Atención por WhatsApp GoodThings"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>
    </div>
  );
}
