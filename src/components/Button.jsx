import React from 'react';
import { cn } from '../utils/utils';

export function Button({ variant = 'primary', className, children, ...props }) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button className={cn(baseClass, className)} {...props}>
      {children}
    </button>
  );
}
