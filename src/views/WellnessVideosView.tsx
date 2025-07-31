import React, { useState, useEffect, useCallback } from 'react';
import { WellnessVideo, View } from '../types';
import { ApiClient } from '../utils/ApiClient';
import VideoPlayer from '../components/VideoPlayer';
import { AppButton } from '../components/AppButton';
import { PlusIcon } from '../components/icons';
import { useNotification } from '../contexts/NotificationContext';

export const WellnessVideosView: React.FC<{
    setActiveView: (view: View) => void;
}> = ({ setActiveView }) => {
    const [videos, setVideos] = useState<WellnessVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useNotification();

    const fetchVideos = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await ApiClient.videos.getVideos();
            setVideos(data);
        } catch (error) {
            console.error("Failed to fetch wellness videos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    if (isLoading) {
        return <div className="loading-spinner" style={{ margin: 'auto', borderColor: '#fff', borderTopColor: 'var(--accent-primary)' }}></div>;
    }

    return (
        <div className="wellness-videos-view">
            <AppButton 
                onClick={() => setActiveView('upload-video')}
                className="upload-video-fab"
                icon={<PlusIcon />}
                aria-label="Upload new video"
            />
            {videos.map(video => (
                <VideoPlayer key={video.id} video={video} onComment={() => addToast("Commenting feature coming soon!", 'info')} onShare={() => addToast("Sharing feature coming soon!", 'info')} />
            ))}
        </div>
    );
};