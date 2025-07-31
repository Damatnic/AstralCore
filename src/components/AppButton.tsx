import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';

interface AppButtonProps {
  children?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  'aria-label'?: string;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  style,
  icon,
  'aria-label': ariaLabel,
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={style}
      aria-label={ariaLabel}
    >
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
            {icon}
            {children}
        </>
      )}
    </button>
  );
};