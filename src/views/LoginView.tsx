import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppButton } from '../components/AppButton';
import { GoogleIcon, AppleIcon } from '../components/icons';
import { Card } from '../components/Card';
import i18n from '../i18n';

export const LoginView: React.FC = () => {
    const { login, isLoading } = useAuth();

    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        login();
    };

    return (
        <>
            <div className="view-header">
                <h1>{i18n.t('helper_signin_signup')}</h1>
                <p className="view-subheader">
                    {i18n.t('helper_dashboard_access')}
                </p>
            </div>
            <Card className="auth-card">
                 <p style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                    Our helpers use a secure, external provider for authentication. This keeps your helper identity separate from the anonymous peer support system.
                </p>
                
                <AppButton
                    onClick={handleLoginClick}
                    isLoading={isLoading}
                    className="btn-full-width"
                >
                    {i18n.t('signin_signup_email')}
                </AppButton>
                
                <div className="auth-separator">{i18n.t('continue_with')}</div>
                
                <div className="social-login-buttons">
                    <AppButton onClick={handleLoginClick} variant="secondary" className="btn-social" icon={<GoogleIcon/>}>
                        <span>{i18n.t('signin_google')}</span>
                    </AppButton>
                    <AppButton onClick={handleLoginClick} variant="secondary" className="btn-social" icon={<AppleIcon/>}>
                        <span>{i18n.t('signin_apple')}</span>
                    </AppButton>
                </div>

                 <p className="auth-toggle" style={{marginTop: '2rem'}}>
                    {i18n.t('signin_agreement')}
                </p>
            </Card>
        </>
    );
};