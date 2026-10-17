import React from 'react';
import { GoodThingsLogo } from './GoodThingsLogo';

interface LogoProps {
  width?: number | string;
  className?: string;
}

export const TheBrosToysLogo: React.FC<LogoProps> = ({ className = '' }) => {
  return <GoodThingsLogo className={className} />;
};

export default TheBrosToysLogo;
