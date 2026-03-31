import React from 'react';
import { cn } from '../utils/utils';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("glass-panel", className)} {...props}>
      {children}
    </div>
  );
}
