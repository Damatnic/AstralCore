import React, { useState, useEffect, useCallback } from 'react';
import { Helper, View, CommunityStats } from '../types';
import { AppButton } from '../components/AppButton';
import { ApiClient } from '../utils/ApiClient';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { AppTextArea } from '../components/AppInput';
import { formatTimeAgo } from '../utils/formatTimeAgo';

export const AdminDashboardView: React.FC<{
    onUpdateApplicationStatus: (helperId: string, status: Helper['applicationStatus'], notes?: string) => void;
}> = ({ onUpdateApplicationStatus }) => {
    const [activeTab, setActiveTab] = useState<'vetting' | 'analytics'>('vetting');
    const [applications, setApplications] = useState<Helper[]>([]);
    const [stats, setStats] = useState<CommunityStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState<Helper | null>(null);
    const [applicantDetails, setApplicantDetails] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionNotes, setRejectionNotes] = useState('');

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await ApiClient.admin.getApplications();
            setApplications(data);
        } catch(err) {
            console.error(err);
            alert("Failed to load applications.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await ApiClient.admin.getCommunityStats();
            setStats(data);
        } catch(err) {
            console.error(err);
            alert("Failed to load community stats.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'vetting') {
            fetchApplications();
        } else if (activeTab === 'analytics') {
            fetchStats();
        }
    }, [activeTab, fetchApplications, fetchStats]);

    const handleViewApplicant = async (applicant: Helper) => {
        setSelectedApplicant(applicant);
        setRejectionNotes('');
        try {
            const details = await ApiClient.admin.getApplicantDetails(applicant.id);
            setApplicantDetails(details);
            setIsModalOpen(true);
        } catch (err) {
            alert("Failed to load applicant details.");
        }
    };
    
    const handleApprove = () => {
        if (selectedApplicant) {
            onUpdateApplicationStatus(selectedApplicant.id, 'approved');
            setIsModalOpen(false);
            fetchApplications();
        }
    };
    
    const handleReject = () => {
        if (selectedApplicant && rejectionNotes.trim()) {
            onUpdateApplicationStatus(selectedApplicant.id, 'rejected', rejectionNotes);
            setIsModalOpen(false);
            fetchApplications();
        } else {
            alert("Please provide rejection notes.");
        }
    };

    const renderVettingTab = () => (
        <Card>
            {isLoading ? <div className="loading-spinner" /> : applications.length > 0 ? (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{borderBottom: '2px solid var(--border-color)'}}>
                            <th style={{padding: '0.75rem', textAlign: 'left'}}>Display Name</th>
                            <th style={{padding: '0.75rem', textAlign: 'left'}}>Application Date</th>
                            <th style={{padding: '0.75rem', textAlign: 'left'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                                <td style={{padding: '0.75rem'}}>{app.displayName}</td>
                                <td style={{padding: '0.75rem'}}>{new Date(app.joinDate).toLocaleDateString()}</td>
                                <td style={{padding: '0.75rem'}}><AppButton className="btn-sm" onClick={() => handleViewApplicant(app)}>Review</AppButton></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No pending applications.</p>}
        </Card>
    );
    
    const renderAnalyticsTab = () => (
        isLoading || !stats ? <div className="loading-spinner" /> : (
            <div className="stats-grid">
                <Card className="stat-card"><h3>Active Dilemmas</h3><div className="stat-number">{stats.activeDilemmas}</div></Card>
                <Card className="stat-card"><h3>Avg. Time to Support</h3><div className="stat-number text">{stats.avgTimeToFirstSupport}</div></Card>
                <Card className="stat-card"><h3>Total Helpers</h3><div className="stat-number">{stats.totalHelpers}</div></Card>
                <Card className="stat-card"><h3>Most Common Category</h3><div className="stat-number text">{stats.mostCommonCategory}</div></Card>
            </div>
        )
    );

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Review Application: ${selectedApplicant?.displayName}`}>
                {applicantDetails ? (
                    <div>
                        <h3>Applicant Details</h3>
                        <p><strong>Bio:</strong> {applicantDetails.bio}</p>
                        <p><strong>Expertise:</strong> {applicantDetails.expertise.join(', ')}</p>
                        <p><strong>Joined:</strong> {formatTimeAgo(applicantDetails.joinDate)}</p>
                        <hr style={{margin: '1rem 0'}} />
                        <h3>Performance Stats</h3>
                        <p><strong>Posts Supported:</strong> {applicantDetails.stats.postsSupported}</p>
                        <p><strong>Reputation:</strong> {applicantDetails.stats.reputation.toFixed(2)} / 5.0</p>
                        <p><strong>Training Quiz Score:</strong> {applicantDetails.quizScore * 100}%</p>
                         <hr style={{margin: '1rem 0'}} />
                         <h3>Actions</h3>
                         <AppTextArea label="Rejection Notes (if rejecting)" value={rejectionNotes} onChange={(e) => setRejectionNotes(e.target.value)} rows={3} />
                        <div className="modal-actions">
                            <AppButton variant="danger" onClick={handleReject}>Reject</AppButton>
                            <AppButton variant="success" onClick={handleApprove}>Approve</AppButton>
                        </div>
                    </div>
                ) : <div className="loading-spinner"/>}
            </Modal>
            
            <div className="view-header">
                <h1>Admin Dashboard</h1>
                <p className="view-subheader">Oversee community health and helper applications.</p>
            </div>
            <div className="dashboard-tabs">
                <AppButton className={activeTab === 'vetting' ? 'active' : ''} onClick={() => setActiveTab('vetting')}>Helper Vetting ({applications.length})</AppButton>
                <AppButton className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Community Analytics</AppButton>
            </div>
            <div className="dashboard-content">
                {activeTab === 'vetting' ? renderVettingTab() : renderAnalyticsTab()}
            </div>
        </>
    );
};
