"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Clock, Calendar, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import VideoModal from "@/components/ui/video-modal";

export interface WorkoutLevel {
  value: 'basic' | 'intermediate' | 'advanced';
  label: string;
}

export interface DailyLiftProps {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  duration: number; // in minutes
  date: Date;
  level: WorkoutLevel;
}

export const DailyLiftCard: React.FC<DailyLiftProps> = ({
  id,
  title,
  description,
  imageUrl,
  videoUrl,
  duration,
  date,
  level,
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  // Format the date to display in a user-friendly way
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);

  // Determine the badge color based on the workout level
  const getLevelColor = (level: WorkoutLevel['value']) => {
    switch (level) {
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

  // Determine the workout URL
  const liftUrl = id === 'today-workout' || id === 'today' ? '/workouts/today' : `/workouts/${id}`;

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => videoUrl && setVideoModalOpen(true)}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/80 rounded-full p-3 shadow-lg transform transition-transform hover:scale-110">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            )}
            
            <Badge 
              className={`absolute top-3 right-3 ${getLevelColor(level.value)}`}
              variant="outline"
            >
              {level.label}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              <span>{duration} minutes</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <ButtonGroup>
            {videoUrl ? (
              <Button 
                onClick={() => setVideoModalOpen(true)}
              >
                <Play className="h-4 w-4 mr-2" /> Start Lift
              </Button>
            ) : (
              <Button 
                disabled
              >
                No Video Available
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={liftUrl}>
                Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
      
      {videoUrl && (
        <VideoModal
          title={title}
          description={description}
          videoUrl={videoUrl}
          thumbnailUrl={imageUrl}
          isOpen={videoModalOpen}
          onOpenChange={setVideoModalOpen}
        />
      )}
    </>
  );
};

// For backward compatibility
export const DailyWorkoutCard = DailyLiftCard;

export default DailyLiftCard; 