import React from 'react';
import styles from './GoodThingsLogo.module.css';

interface LogoProps {
  className?: string;
  variant?: 'navy' | 'white' | 'badge';
  size?: 'sm' | 'md' | 'lg';
}

export const GoodThingsLogo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'navy',
  size = 'md' 
}) => {
  return (
    <div className={`${styles.logoWrapper} ${styles[variant]} ${styles[size]} ${className}`}>
      <span className={styles.logoText}>GOODTHINGS</span>
      <span className={styles.logoBadgeDot}>•</span>
    </div>
  );
};

export default GoodThingsLogo;
