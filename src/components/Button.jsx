import React from 'react';
import { cn } from '../utils/utils';
import { vibrateClick } from '../utils/haptics';

export function Button({ variant = 'primary', className, children, onClick, ...props }) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  const handleClick = (e) => {
    vibrateClick();
    if (onClick) onClick(e);
  };

  return (
    <button className={cn(baseClass, className)} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
