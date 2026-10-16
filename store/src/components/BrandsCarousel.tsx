'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './BrandsCarousel.module.css';

interface Brand {
  id: number;
  name: string;
  logo_url: string;
}

export default function BrandsCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrand = searchParams.get('brand');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands?active=true`);
        if (res.ok) {
          const data = await res.json();
          setBrands(data);
        }
      } catch (err) {
        console.error('Error fetching active brands:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [brands]);

  const handleBrandClick = (brandName: string) => {
    if (selectedBrand === brandName) {
      router.push('/');
    } else {
      router.push(`/?brand=${encodeURIComponent(brandName)}`);
    }
  };

  const scrollLeftAction = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRightAction = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (loading || brands.length === 0) return null;

  // Desktop usa el array repetido para el marquee infinito
  const repeatedBrands = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  const renderBrand = (brand: Brand, index: number, isMobile: boolean) => {
    const isSelected = selectedBrand === brand.name;
    const itemClass = `${styles.brandItem} ${isSelected ? styles.selected : ''}`;
    const key = `${isMobile ? 'm' : 'd'}-${brand.id}-${index}`;

    return brand.logo_url ? (
      <div key={key} className={itemClass} onClick={() => handleBrandClick(brand.name)}>
        <img src={brand.logo_url} alt={brand.name} className={styles.brandLogo} />
      </div>
    ) : (
      <div key={key} className={`${styles.brandItemText} ${isSelected ? styles.selected : ''}`} onClick={() => handleBrandClick(brand.name)}>
        <span>{brand.name}</span>
      </div>
    );
  };

  return (
    <div className={styles.carouselContainer}>

      {/* Desktop Version: Infinite Marquee */}
      <div className={styles.desktopCarousel}>
        <div className={styles.carouselTrack}>
          <div className={styles.marqueeContent}>
            {repeatedBrands.map((brand, index) => renderBrand(brand, index, false))}
          </div>
        </div>
      </div>

      {/* Mobile Version: Static with Scroll Arrow */}
      <div className={styles.mobileCarousel}>
        {canScrollLeft && (
          <button className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`} onClick={scrollLeftAction} aria-label="Desplazar a la izquierda">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        <div className={styles.mobileTrack} ref={scrollRef} onScroll={checkScroll}>
          {brands.map((brand, index) => renderBrand(brand, index, true))}
        </div>
        {canScrollRight && (
          <button className={`${styles.scrollArrow} ${styles.scrollArrowRight}`} onClick={scrollRightAction} aria-label="Desplazar a la derecha">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>

    </div>
  );
}
