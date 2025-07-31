import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({ children, className, style, onClick }) => {
  return (
    <div className={`card ${className || ''}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
};