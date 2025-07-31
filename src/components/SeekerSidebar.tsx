import React from 'react';
import { View, ActiveView } from '../types';
import {
  ShareIcon,
  FeedIcon,
  CrisisIcon,
  HelperIcon,
  SettingsIcon,
  GuidelinesIcon,
  LegalIcon,
  MyPostsIcon,
  SafetyPlanIcon,
  QuietSpaceIcon,
  AICompanionIcon,
  UsersIcon,
  SparkleIcon,
  HeartIcon,
  VideoIcon,
  WellnessIcon,
  ClipboardCheckIcon,
} from './icons';
import i18n from '../i18n';
import { useChatStore } from '../stores/chatStore';
import { AnimatedNumber } from './AnimatedNumber';

const NavItem = React.memo<{
  view: View;
  icon: React.ReactNode;
  label: string;
  hasNotification?: boolean;
  onClick?: () => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}>(({ view, icon, label, hasNotification, onClick, activeView, setActiveView }) => (
  <li className="nav-item">
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick ? onClick() : setActiveView({ view });
      }}
      className={`nav-link ${activeView.view === view ? 'active' : ''}`}
      aria-current={activeView.view === view ? 'page' : undefined}
    >
      {icon}
      <span>{label}</span>
      {hasNotification && <div className="notification-dot"></div>}
    </a>
  </li>
));

export const SeekerSidebar: React.FC<{
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userToken: string | null;
  onlineHelperCount: number;
}> = ({ activeView, setActiveView, userToken, onlineHelperCount }) => {
  const { hasUnreadNotifications } = useChatStore();

  return (
    <>
      <ul className="sidebar-nav">
        <NavItem
          view="share"
          icon={<ShareIcon />}
          label={i18n.t('share')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="my-activity"
          icon={<MyPostsIcon />}
          label={i18n.t('my_activity')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="ai-chat"
          icon={<AICompanionIcon />}
          label={i18n.t('ai_chat')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="safety-plan"
          icon={<SafetyPlanIcon />}
          label={i18n.t('my_safety_plan')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="wellness-tracking"
          icon={<WellnessIcon />}
          label="My Wellness"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="assessments"
          icon={<ClipboardCheckIcon />}
          label="Assessments"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="feed"
          icon={<FeedIcon />}
          label={i18n.t('community_feed')}
          hasNotification={hasUnreadNotifications}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="reflections"
          icon={<SparkleIcon />}
          label={i18n.t('reflections')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="wellness-videos"
          icon={<VideoIcon />}
          label={i18n.t('wellness_videos')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="crisis"
          icon={<CrisisIcon />}
          label={i18n.t('get_help_now')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="quiet-space"
          icon={<QuietSpaceIcon />}
          label={i18n.t('quiet_space')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="donation"
          icon={<HeartIcon />}
          label={i18n.t('donate')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <li className="nav-separator"></li>
        {userToken && (
          <NavItem
            view="moderation-history"
            icon={<LegalIcon />}
            label={i18n.t('moderation_history')}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        )}
        <NavItem
          view="guidelines"
          icon={<GuidelinesIcon />}
          label={i18n.t('guidelines')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="legal"
          icon={<LegalIcon />}
          label={i18n.t('legal')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="login"
          icon={<HelperIcon />}
          label={i18n.t('helper_login')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="settings"
          icon={<SettingsIcon />}
          label={i18n.t('settings')}
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </ul>
      <div className="sidebar-footer">
        <div className="online-status">
          <UsersIcon />
          <span>
            <AnimatedNumber value={onlineHelperCount} /> Helper{onlineHelperCount !== 1 ? 's' : ''} Online
          </span>
        </div>
      </div>
    </>
  );
};