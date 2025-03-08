"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ChevronRight, Dumbbell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface WorkoutLevel {
  value: 'basic' | 'intermediate' | 'advanced';
  label: string;
}

export interface DailyLiftProps {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  duration: number; // in minutes
  date: Date;
  level: WorkoutLevel;
}

export const DailyLiftCard: React.FC<DailyLiftProps> = ({
  id,
  title,
  description,
  imageUrl,
  duration,
  date,
  level,
}) => {
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
  const liftUrl = id === 'today-workout' ? '/workouts/today' : `/workouts/${id}`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge 
          className={`absolute top-3 right-3 ${getLevelColor(level.value)}`}
          variant="outline"
        >
          {level.label}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "Today's facial fitness lift to keep your muscles toned and lifted."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{duration} minutes</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Dumbbell className="mr-2 h-4 w-4" />
            <span>{level.label} Level</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link href={liftUrl} className="w-full">
          <Button className="w-full" variant="default">
            Start Lift <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// For backward compatibility
export const DailyWorkoutCard = DailyLiftCard;

export default DailyLiftCard; 