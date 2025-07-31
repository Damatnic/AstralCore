import React from 'react';
import { CloseIcon } from './icons';
import { Card } from './Card';

export const Modal: React.FC<{ isOpen: boolean; onClose?: () => void; children: React.ReactNode; title: string; isDismissible?: boolean; }> = ({ isOpen, onClose, children, title, isDismissible = true }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={isDismissible ? onClose : undefined}>
            <Card className="modal-panel" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    {isDismissible && (
                        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
                            <CloseIcon />
                        </button>
                    )}
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </Card>
        </div>
    );
};