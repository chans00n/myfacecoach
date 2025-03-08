"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Workout } from "@/types/workout";
import VideoModal from "@/components/ui/video-modal";

interface LiftCardProps {
  workout: Workout;
  href: string;
}

export const LiftCard: React.FC<LiftCardProps> = ({ workout, href }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(workout.date);

  // Determine the badge color based on the workout level
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'basic':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    if (workout.videoUrl) {
      e.preventDefault();
      setVideoModalOpen(true);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <Link href={href} className="block h-full">
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={handleVideoClick}
            >
              <Image
                src={workout.imageUrl}
                alt={workout.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {workout.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/80 rounded-full p-3">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
              
              <Badge 
                className={`absolute top-3 right-3 ${getLevelColor(workout.level.value)}`}
                variant="outline"
              >
                {workout.level.label}
              </Badge>
            </div>
          </Link>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{workout.title}</CardTitle>
          <CardDescription>{workout.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              <span>{workout.totalDuration} minutes total</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex gap-2">
          {workout.videoUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={handleVideoClick}
            >
              <Play className="h-4 w-4 mr-2" /> Watch
            </Button>
          )}
          <Button asChild className={workout.videoUrl ? "flex-1" : "w-full"}>
            <Link href={href}>
              Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {workout.videoUrl && (
        <VideoModal
          title={workout.title}
          description={workout.description}
          videoUrl={workout.videoUrl}
          thumbnailUrl={workout.imageUrl}
          isOpen={videoModalOpen}
          onOpenChange={setVideoModalOpen}
        />
      )}
    </>
  );
};

// For backward compatibility
export const WorkoutCard = LiftCard;

export default LiftCard; 