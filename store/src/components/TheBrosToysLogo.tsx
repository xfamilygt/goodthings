import React from 'react';
import styles from './TheBrosToysLogo.module.css';

interface LogoProps {
  width?: number | string;
  className?: string;
}

export const TheBrosToysLogo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.logoContainer} ${className}`}>
      <span>TheBrosT</span>
      
      {/* Carita Vectorial Integrada como la 'o' */}
      <svg 
        viewBox="-4 -4 42 56" 
        className={styles.faceIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        {/* Contorno del rostro (Letra O más gruesa y sin recortes) */}
        <rect x="0" y="0" width="34" height="48" rx="14" fill="none" stroke="currentColor" strokeWidth="3" />
        
        {/* Máscara negra */}
        <path d="M 0 20 L 34 20 L 34 32 L 17 38 L 0 32 Z" fill="currentColor" />
        
        {/* Ojos */}
        <path className={styles.logoEyes} d="M 2 23 L 14 26 L 2 27 Z" fill="#ffffff" />
        <path className={styles.logoEyes} d="M 32 23 L 20 26 L 32 27 Z" fill="#ffffff" />
        
        {/* Boca */}
        <rect x="12" y="40" width="10" height="2.5" fill="currentColor" />
      </svg>

      <span>ys</span>
    </div>
  );
};
