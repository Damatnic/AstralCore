import React from 'react';

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerStyle?: React.CSSProperties;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  id,
  className = '',
  containerStyle,
  ...rest
}) => {
  return (
    <div className="form-group" style={containerStyle}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={`form-control ${className}`}
        {...rest}
      />
    </div>
  );
};

interface AppTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    containerStyle?: React.CSSProperties;
    footer?: React.ReactNode;
}

export const AppTextArea: React.FC<AppTextAreaProps> = ({
    label,
    id,
    className = '',
    containerStyle,
    footer,
    ...rest
}) => {
    return (
        <div className={`form-group`} style={containerStyle}>
            {label && <label htmlFor={id}>{label}</label>}
            <textarea
                id={id}
                className={`form-control ${className}`}
                {...rest}
            />
            {footer && <div className="form-group-footer">{footer}</div>}
        </div>
    );
};