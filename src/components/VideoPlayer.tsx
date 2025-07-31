import React, { useState, useRef, useEffect } from 'react';
import { WellnessVideo } from '../types';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { HeartIcon, ShareIcon } from './icons';
import { ApiClient } from '../utils/ApiClient';
import { formatTimeAgo } from '../utils/formatTimeAgo';

interface VideoPlayerProps {
    video: WellnessVideo;
    onComment: () => void;
    onShare: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video: initialVideo, onComment, onShare }) => {
    const [video, setVideo] = useState(initialVideo);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showPlayIcon, setShowPlayIcon] = useState(false);
    
    const isInView = useIntersectionObserver(videoRef, { threshold: 0.5 });

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isInView) {
                videoElement.play().catch(e => console.error("Autoplay failed:", e));
                setIsPlaying(true);
            } else {
                videoElement.pause();
                setIsPlaying(false);
            }
        }
    }, [isInView]);

    const handleVideoClick = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isPlaying) {
                videoElement.pause();
                setShowPlayIcon(true);
            } else {
                videoElement.play();
                setShowPlayIcon(false);
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const handleLike = () => {
        ApiClient.videos.likeVideo(video.id).then(updatedVideo => {
            setVideo(updatedVideo);
        });
    };

    const handleShare = () => {
        if(navigator.share) {
            navigator.share({
                title: 'Check out this wellness video!',
                text: video.description,
                url: window.location.href,
            })
        } else {
            onShare();
        }
    };

    const getColorIndex = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 8);
    };


    return (
        <div className="video-player-wrapper">
            <video
                ref={videoRef}
                src={video.videoUrl}
                className="video-player"
                loop
                playsInline
                muted={isMuted}
                onClick={handleVideoClick}
            />
             <div className={`video-play-pause-icon ${showPlayIcon && !isPlaying ? 'visible' : ''}`}>
                ▶
            </div>
            <div className="video-overlay">
                <div className="video-info">
                    <div className="post-user-info">
                        <div className={`avatar avatar-color-${getColorIndex(video.userToken)}`}></div>
                        <span className="username">Anonymous User • {formatTimeAgo(video.timestamp)}</span>
                    </div>
                    <p className="description">{video.description}</p>
                </div>
                <div className="video-actions">
                    <button className={`video-action-button ${video.isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        <HeartIcon />
                        <span>{video.likes.toLocaleString()}</span>
                    </button>
                     <button className="video-action-button" onClick={onComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>
                        <span>{video.comments.toLocaleString()}</span>
                    </button>
                     <button className="video-action-button" onClick={handleShare}>
                        <ShareIcon />
                        <span>{video.shares.toLocaleString()}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;