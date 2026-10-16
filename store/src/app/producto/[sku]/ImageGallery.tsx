"use client";
import { useState } from "react";
import styles from "./producto.module.css";

interface ImageItem {
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export default function ImageGallery({ images, fallbackName }: { images: ImageItem[], fallbackName: string }) {
  // Sort images so primary is first, then by display_order
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sortedImages[activeIndex]?.image_url || "/placeholder.jpg";

  return (
    <>
      <div className={styles.thumbnails}>
        {sortedImages.map((img, idx) => (
          <button 
            key={idx} 
            className={`${styles.thumbBtn} ${activeIndex === idx ? styles.active : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            <img src={img.image_url} alt={`${fallbackName} thumbnail ${idx}`} className={styles.thumbImg} />
          </button>
        ))}
      </div>
      <div className={styles.mainImageContainer}>
        <img src={activeImage} alt={fallbackName} className={styles.mainImage} />
      </div>
    </>
  );
}
