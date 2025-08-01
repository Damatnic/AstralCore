/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { Sidebar } from './src/components/Sidebar';
import { ToastContainer } from './src/components/Toast';
import { Modal } from './src/components/Modal';
import { AuthProvider, useAuth, useLegalConsents } from './src/contexts/AuthContext';
import { AppButton } from './src/components/AppButton';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NotificationProvider, useNotification } from './src/contexts/NotificationContext';
import i18n from './src/i18n';

import { ActiveView, Dilemma, Helper, View } from './src/types';
import { useInterval } from './src/hooks/useInterval';
import { useDilemmaStore } from './src/stores/dilemmaStore';
import { useChatStore } from './src/stores/chatStore';
import { useSessionStore } from './src/stores/sessionStore';
import { useAIChat } from './src/hooks/useAIChat';
import { ReportModalContent } from './src/components/ReportModal';
import { ApiClient } from './src/utils/ApiClient';
import { notificationService } from './src/services/notificationService';
import { authService } from './src/services/authService';

// --- Lazy Load Views for Code Splitting ---
const ShareView = lazy(() => import('./src/views/ShareView').then(module => ({ default: module.ShareView })));
const FeedView = lazy(() => import('./src/views/FeedView').then(module => ({ default: module.FeedView })));
const CrisisResourcesView = lazy(() => import('./src/views/CrisisResourcesView').then(module => ({ default: module.CrisisResourcesView })));
const LoginView = lazy(() => import('./src/views/LoginView').then(module => ({ default: module.LoginView })));
const SettingsView = lazy(() => import('./src/views/SettingsView').then(module => ({ default: module.SettingsView })));
const CommunityGuidelinesView = lazy(() => import('./src/views/CommunityGuidelinesView').then(module => ({ default: module.CommunityGuidelinesView })));
const LegalView = lazy(() => import('./src/views/LegalView').then(module => ({ default: module.LegalView })));
const HelperDashboardView = lazy(() => import('./src/views/HelperDashboardView').then(module => ({ default: module.HelperDashboardView })));
const ChatView = lazy(() => import('./src/views/ChatView').then(module => ({ default: module.ChatView })));
const SafetyPlanView = lazy(() => import('./src/views/SafetyPlanView').then(module => ({ default: module.SafetyPlanView })));
const QuietSpaceView = lazy(() => import('./src/views/QuietSpaceView').then(module => ({ default: module.QuietSpaceView })));
const AIChatView = lazy(() => import('./src/views/AIChatView').then(module => ({ default: module.AIChatView })));
const VideoChatView = lazy(() => import('./src/views/VideoChatView').then(module => ({ default: module.VideoChatView })));
const WellnessVideosView = lazy(() => import('./src/views/WellnessVideosView').then(module => ({ default: module.WellnessVideosView })));
const UploadVideoView = lazy(() => import('./src/views/UploadVideoView').then(module => ({ default: module.UploadVideoView })));
const CreateHelperProfileView = lazy(() => import('./src/views/CreateHelperProfileView').then(module => ({ default: module.CreateHelperProfileView })));
const HelperProfileView = lazy(() => import('./src/views/HelperProfileView').then(module => ({ default: module.HelperProfileView })));
const HelperCommunityView = lazy(() => import('./src/views/HelperCommunityView').then(module => ({ default: module.HelperCommunityView })));
const ReflectionsView = lazy(() => import('./src/views/ReflectionsView').then(module => ({ default: module.ReflectionsView })));
const ModerationHistoryView = lazy(() => import('./src/views/ModerationHistoryView').then(module => ({ default: module.ModerationHistoryView })));
const BlockedUsersView = lazy(() => import('./src/views/BlockedUsersView').then(module => ({ default: module.BlockedUsersView })));
const MyActivityView = lazy(() => import('./src/views/MyActivityView').then(module => ({ default: module.MyActivityView })));
const PublicHelperProfileView = lazy(() => import('./src/views/PublicHelperProfileView').then(module => ({ default: module.PublicHelperProfileView })));
const ModerationDashboardView = lazy(() => import('./src/views/ModerationDashboardView').then(module => ({ default: module.ModerationDashboardView })));
const AdminDashboardView = lazy(() => import('./src/views/AdminDashboardView').then(module => ({ default: module.AdminDashboardView })));
const HelperTrainingView = lazy(() => import('./src/views/HelperTrainingView').then(module => ({ default: module.HelperTrainingView })));
const HelperApplicationView = lazy(() => import('./src/views/HelperApplicationView').then(module => ({ default: module.HelperApplicationView })));
const DonationView = lazy(() => import('./src/views/DonationView').then(module => ({ default: module.DonationView })));
const WellnessView = lazy(() => import('./src/views/WellnessView').then(module => ({ default: module.WellnessView })));
const AssessmentsView = lazy(() => import('./src/views/AssessmentsView').then(module => ({ default: module.AssessmentsView })));
const AssessmentHistoryView = lazy(() => import('./src/views/AssessmentHistoryView').then(module => ({ default: module.AssessmentHistoryView })));
const AssessmentDetailView = lazy(() => import('./src/views/AssessmentDetailView').then(module => ({ default: module.AssessmentDetailView })));


const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </NotificationProvider>
);

const SplashScreen: React.FC = () => (
    <div className="splash-screen">
        <div className="splash-logo">Astral Core</div>
        <p className="view-subheader" style={{ marginTop: '1rem' }}>Loading your safe space...</p>
    </div>
);

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>({ view: 'feed' });
  const { requiredConsent, allConsentsGiven, acceptConsent, getConsentContent } = useLegalConsents();
  
  const { isAuthenticated, logout, user, isNewUser, helperProfile, reloadProfile, userToken, updateHelperProfile } = useAuth();
  const {
    reportDilemma,
    isReportModalOpen,
    closeReportModal,
    postDilemma,
    getDilemmaById,
  } = useDilemmaStore();
  const { activeChat } = useChatStore();
  const { 
    videoChatDilemmaId, 
    isVideoConsentModalOpen, 
    acceptVideoConsent, 
    declineVideoConsent, 
    endVideoChat 
  } = useSessionStore();
  const { addToast, confirmationModal, showConfirmationModal, hideConfirmationModal } = useNotification();
  const { session: aiChatSession, sendMessage: handleSendAIMessage, resetAIChat } = useAIChat();

  const [onlineHelperCount, setOnlineHelperCount] = useState(0);
  const [viewingHelperProfileId, setViewingHelperProfileId] = useState<string | null>(null);

  useEffect(() => {
    notificationService.setToastFunction(addToast);
  }, [addToast]);

  useEffect(() => {
    authService.setUpdater(updateHelperProfile);
  }, [updateHelperProfile]);

  useEffect(() => {
    if (isAuthenticated && activeView.view === 'login') {
        if (!isNewUser) {
            setActiveView({ view: 'dashboard' });
            addToast('Successfully logged in as a Helper.');
        } else {
             setActiveView({ view: 'create-profile' });
        }
    }
  }, [isAuthenticated, activeView, isNewUser, addToast]);

  useInterval(async () => {
    try {
        const count = await ApiClient.helpers.getOnlineHelperCount();
        setOnlineHelperCount(count);
    } catch (error) {
        console.error("Failed to fetch online helper count:", error);
    }
  }, 5000); 

  const handleLogout = async () => {
    await logout();
    setActiveView({ view: 'feed' });
    addToast('You have been logged out.');
  }
  
  const handleReportSubmit = (reason: string) => {
    reportDilemma(reason);
    closeReportModal();
    addToast('Thank you for your report. A helper will review it shortly.', 'info');
  };
  
  const handleViewHelperProfile = (helperId: string) => {
    setViewingHelperProfileId(helperId);
    setActiveView({ view: 'public-helper-profile' });
  };

  const handlePostSubmit = async (dilemmaData: Omit<Dilemma, 'id' | 'userToken' | 'supportCount' | 'isSupported' | 'isReported' | 'reportReason' | 'status' | 'assignedHelperId' | 'resolved_by_seeker' | 'requestedHelperId' | 'summary' | 'summaryLoading' | 'moderation' | 'aiMatchReason'>) => {
    if (!userToken) {
      addToast('Cannot post without a user token.', 'error');
      return;
    }
    try {
      await postDilemma(dilemmaData, userToken);
      addToast('Your post has been shared anonymously!', 'success');
      setActiveView({ view: 'feed' });
    } catch (error) {
      console.error(error);
      addToast('Failed to share your post.', 'error');
    }
  };

  const handleUpdateApplicationStatus = async (helperId: string, status: Helper['applicationStatus'], notes?: string) => {
    if (!helperProfile) {
        addToast('You must be logged in to perform this action.', 'error');
        return;
    }
    try {
        await ApiClient.admin.updateApplicationStatus(helperId, status, helperProfile, notes);
        addToast(`Helper application ${status}.`, 'success');
    } catch (error) {
        addToast('Failed to update application. Please try again.', 'error');
    }
  }
  
  const handleResetId = () => {
    localStorage.removeItem('userToken');
    window.location.reload();
    resetAIChat();
    addToast('Your anonymous ID has been reset.', 'info');
  };

  const renderContent = () => {
    // Enforce helper profile creation for new users
    if (isAuthenticated && isNewUser) {
      return <CreateHelperProfileView onProfileCreated={reloadProfile} setActiveView={(view: View) => setActiveView({ view })} />;
    }

    if (activeView.view === 'video-chat' && videoChatDilemmaId) {
      const dilemma = getDilemmaById(videoChatDilemmaId);
      if (dilemma) {
        return <VideoChatView dilemma={dilemma} onClose={endVideoChat} />;
      }
    }
    if (activeChat) {
        const dilemma = getDilemmaById(activeChat.dilemmaId);
        if (dilemma) {
            return <ChatView session={activeChat} dilemma={dilemma} onViewHelperProfile={handleViewHelperProfile}/>;
        }
    }
    
    let currentView = isAuthenticated && activeView.view === 'feed' ? 'dashboard' : activeView.view;
     if (viewingHelperProfileId) {
        currentView = 'public-helper-profile';
    }

    switch (currentView) {
      case 'share': return <ShareView onPostSubmit={handlePostSubmit} userToken={userToken} />;
      case 'feed': return <FeedView />;
      case 'crisis': return <CrisisResourcesView />;
      case 'login': return <LoginView />;
      case 'settings': return <SettingsView userToken={userToken} onResetId={handleResetId} setActiveView={(view) => setActiveView({ view })} />;
      case 'guidelines': return <CommunityGuidelinesView />;
      case 'legal': return <LegalView />;
      case 'dashboard': return <HelperDashboardView setActiveView={setActiveView} />;
      case 'my-activity': return <MyActivityView setActiveView={setActiveView} onViewHelperProfile={handleViewHelperProfile} userToken={userToken} />;
      case 'safety-plan': return <SafetyPlanView userToken={userToken} />;
      case 'quiet-space': return <QuietSpaceView />;
      case 'wellness-tracking': return <WellnessView />;
      case 'assessments': return <AssessmentsView setActiveView={setActiveView} />;
      case 'assessment-history': return <AssessmentHistoryView setActiveView={setActiveView} />;
      case 'assessment-detail':
        if (activeView.params?.type) {
            return <AssessmentDetailView type={activeView.params.type} setActiveView={setActiveView} />;
        }
        setActiveView({ view: 'assessments' });
        return <AssessmentsView setActiveView={setActiveView} />;
      case 'ai-chat': return <AIChatView session={aiChatSession} onSendMessage={handleSendAIMessage} onClose={() => setActiveView({ view: 'feed' })} />;
      case 'create-profile': return <CreateHelperProfileView onProfileCreated={reloadProfile} setActiveView={(view) => setActiveView({ view })} />;
      case 'helper-profile': return <HelperProfileView onProfileUpdated={reloadProfile} setActiveView={(view) => setActiveView({ view })} />;
      case 'helper-application': return <HelperApplicationView setActiveView={(view) => setActiveView({ view })} />;
      case 'helper-training': return <HelperTrainingView onTrainingComplete={reloadProfile} />;
      case 'helper-community': return <HelperCommunityView />;
      case 'reflections': return <ReflectionsView userToken={userToken} />;
      case 'moderation-history': return <ModerationHistoryView userId={user?.sub || userToken} />;
      case 'wellness-videos': return <WellnessVideosView setActiveView={(view: View) => setActiveView({ view })} />;
      case 'upload-video': return <UploadVideoView onUploadComplete={() => setActiveView({ view: 'wellness-videos' })} userToken={userToken} />;
      case 'moderation-dashboard': 
        if (isAuthenticated && (helperProfile?.role === 'Moderator' || helperProfile?.role === 'Admin')) {
            return <ModerationDashboardView />;
        }
        addToast('Access Denied: You do not have permission to view this page.', 'error');
        setActiveView({ view: 'feed' });
        return <FeedView />;
      case 'admin-dashboard': 
        if (isAuthenticated && helperProfile?.role === 'Admin') {
            return <AdminDashboardView onUpdateApplicationStatus={handleUpdateApplicationStatus} />;
        }
        addToast('Access Denied: You do not have permission to view this page.', 'error');
        setActiveView({ view: 'feed' });
        return <FeedView />;
      case 'blocked-users': return <BlockedUsersView userId={user?.sub || userToken} />;
      case 'public-helper-profile': return <PublicHelperProfileView helperId={viewingHelperProfileId!} onClose={() => { setViewingHelperProfileId(null); setActiveView({ view: 'feed' }); }} setActiveView={setActiveView} />;
      case 'donation': return <DonationView />;
      default: return <FeedView />;
    }
  };
  
  return (
    <>
        <ToastContainer />
        
        {confirmationModal && (
          <Modal
            isOpen={true}
            onClose={confirmationModal.onCancel || hideConfirmationModal}
            title={confirmationModal.title}
          >
            <div>
                <p>{confirmationModal.message}</p>
                 <div className="modal-actions">
                    <AppButton onClick={confirmationModal.onCancel || hideConfirmationModal} variant="secondary">{confirmationModal.cancelText || 'Cancel'}</AppButton>
                    <AppButton onClick={confirmationModal.onConfirm} variant={confirmationModal.confirmVariant || 'primary'}>{confirmationModal.confirmText || 'Confirm'}</AppButton>
                </div>
            </div>
          </Modal>
        )}

        <Modal 
            isOpen={!!requiredConsent}
            title={getConsentContent(requiredConsent).title}
            isDismissible={false}
        >
            <div className="legal-agreement-content">
                <p>{getConsentContent(requiredConsent).text}</p>
                 <p>You can read the full document before accepting.</p>
                 <div className="modal-actions">
                    <AppButton onClick={() => setActiveView({ view: 'legal' })} variant="secondary">Read Full Document</AppButton>
                    <AppButton onClick={acceptConsent} variant="success">I Agree</AppButton>
                </div>
            </div>
        </Modal>

        <Modal 
            isOpen={isReportModalOpen} 
            onClose={closeReportModal}
            title="Report a Post"
        >
            <ReportModalContent 
                onClose={closeReportModal}
                onSubmit={handleReportSubmit}
            />
        </Modal>

        <Modal
            isOpen={isVideoConsentModalOpen}
            onClose={declineVideoConsent}
            title="Video Chat Permission"
        >
            <p>To start a video chat, this application needs access to your camera and microphone. Your video and audio will be shared directly with the other user.</p>
            <p>Do you consent to sharing your camera and microphone?</p>
            <div className="modal-actions">
                <AppButton onClick={declineVideoConsent} variant="secondary">Decline</AppButton>
                <AppButton onClick={() => { acceptVideoConsent(); setActiveView({ view: 'video-chat' }); }} variant="primary">Accept</AppButton>
            </div>
        </Modal>
        
        {!allConsentsGiven ? (
            <SplashScreen />
        ) : (
            <div className={`app-layout ${activeView.view === 'ai-chat' || activeView.view === 'video-chat' || activeChat || ['wellness-videos', 'upload-video'].includes(activeView.view) ? 'chat-active' : ''}`}>
                <Sidebar activeView={activeView} setActiveView={setActiveView} isAuthenticated={isAuthenticated} onLogout={handleLogout} onlineHelperCount={onlineHelperCount} userToken={userToken} helperProfile={helperProfile}/>
                <main className="main-content">
                    <div className="background-blobs">
                        <div className="blob blob1"></div>
                        <div className="blob blob2"></div>
                    </div>
                    <Suspense fallback={<div className="loading-spinner" style={{ margin: 'auto' }}></div>}>
                        <div className="view-content-wrapper" key={activeView.view}>
                            {renderContent()}
                        </div>
                    </Suspense>
                </main>
            </div>
        )}
    </>
  );
};

const App: React.FC = () => (
    <AppProviders>
      <AppContent />
    </AppProviders>
);


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);