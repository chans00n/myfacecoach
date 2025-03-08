"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface VideoModalProps {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function VideoModal({
  title,
  description,
  videoUrl,
  thumbnailUrl,
  isOpen,
  onOpenChange,
  children
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Auto-enter fullscreen on mobile when playing
  useEffect(() => {
    if (isMobile && isPlaying && videoRef.current && !isFullscreen) {
      handleFullscreenToggle();
    }
  }, [isMobile, isPlaying, isFullscreen]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreenToggle = () => {
    if (videoContainerRef.current) {
      if (!isFullscreen) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen();
        } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
          (videoContainerRef.current as any).webkitRequestFullscreen();
        } else if ((videoContainerRef.current as any).msRequestFullscreen) {
          (videoContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null || 
        (document as any).webkitFullscreenElement !== null ||
        (document as any).msFullscreenElement !== null
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className={`sm:max-w-[800px] p-0 overflow-hidden ${isMobile ? 'max-h-[100vh]' : ''}`}>
        <div className="relative" ref={videoContainerRef}>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnailUrl}
            className={`w-full ${isMobile ? 'h-full object-contain' : 'aspect-video'}`}
            playsInline
            onClick={handlePlayPause}
          />
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20" 
                onClick={handleMuteToggle}
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-white hover:bg-white/20 z-10" 
            onClick={() => handleDialogOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {!isFullscreen && (
          <>
            <DialogHeader className="p-6 pt-4">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            
            {children && (
              <div className="px-6 pb-6">
                {children}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default VideoModal; 