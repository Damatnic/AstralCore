import React from 'react';
import { View, Helper, ActiveView } from '../types';
import {
  FeedIcon,
  CrisisIcon,
  HelperIcon,
  SettingsIcon,
  GuidelinesIcon,
  LogoutIcon,
  LegalIcon,
  DashboardIcon,
  UsersIcon,
  CertifiedIcon,
} from './icons';
import i18n from '../i18n';
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

export const HelperSidebar: React.FC<{
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onLogout: () => void;
  helperProfile: Helper;
  onlineHelperCount: number;
}> = ({ activeView, setActiveView, onLogout, helperProfile, onlineHelperCount }) => {
  return (
    <>
      <ul className="sidebar-nav">
        <NavItem
          view="dashboard"
          icon={<DashboardIcon />}
          label="Dashboard"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="helper-profile"
          icon={<HelperIcon />}
          label="My Profile"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="helper-application"
          icon={<CertifiedIcon />}
          label="Certification"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="helper-community"
          icon={<UsersIcon />}
          label="Helper Community"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        {(helperProfile?.role === 'Moderator' || helperProfile?.role === 'Admin') && (
          <NavItem
            view="moderation-dashboard"
            icon={<LegalIcon />}
            label="Moderation"
            activeView={activeView}
            setActiveView={setActiveView}
          />
        )}
        {helperProfile?.role === 'Admin' && (
             <NavItem
                view="admin-dashboard"
                icon={<SettingsIcon />}
                label="Admin Panel"
                activeView={activeView}
                setActiveView={setActiveView}
            />
        )}
        <li className="nav-separator"></li>
        <NavItem
          view="feed"
          icon={<FeedIcon />}
          label="Community Feed"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="crisis"
          icon={<CrisisIcon />}
          label="Resource Library"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <li className="nav-separator"></li>
        <NavItem
          view="guidelines"
          icon={<GuidelinesIcon />}
          label="Guidelines"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="legal"
          icon={<LegalIcon />}
          label="Legal"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          view="login"
          icon={<LogoutIcon />}
          label="Logout"
          onClick={onLogout}
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