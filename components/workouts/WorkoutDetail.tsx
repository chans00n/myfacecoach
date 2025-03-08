"use client";

import React, { useState } from 'react';
import { Workout, Exercise } from '@/types/workout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Calendar, Dumbbell, CheckCircle2, Info, Play } from "lucide-react";
import Image from "next/image";
import VideoModal from "@/components/ui/video-modal";

interface LiftDetailProps {
  workout: Workout;
}

const ExerciseCard: React.FC<{ exercise: Exercise; index: number }> = ({ exercise }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">{exercise.name}</CardTitle>
            <Badge variant="lime" className="ml-2">
              {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
            </Badge>
          </div>
          <CardDescription>{exercise.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="relative h-48 rounded-md overflow-hidden cursor-pointer"
              onClick={() => exercise.videoUrl && setVideoModalOpen(true)}
            >
              {exercise.imageUrl ? (
                <>
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    fill
                    className="object-cover"
                  />
                  {exercise.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-primary/80 rounded-full p-3 shadow-lg transform transition-transform hover:scale-110">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <ol className="list-decimal pl-5 space-y-1">
                {exercise.instructions.map((instruction, i) => (
                  <li key={i} className="text-sm">{instruction}</li>
                ))}
              </ol>
              
              {exercise.tips && exercise.tips.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1">Tips</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {exercise.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex items-center mt-3 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{exercise.duration} seconds</span>
                {exercise.repetitions && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{exercise.repetitions} reps</span>
                  </>
                )}
                {exercise.sets && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{exercise.sets} sets</span>
                  </>
                )}
              </div>
              
              {exercise.videoUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => setVideoModalOpen(true)}
                >
                  <Play className="h-4 w-4 mr-2" /> Watch Video
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {exercise.videoUrl && (
        <VideoModal
          title={exercise.name}
          description={exercise.description}
          videoUrl={exercise.videoUrl}
          thumbnailUrl={exercise.imageUrl}
          isOpen={videoModalOpen}
          onOpenChange={setVideoModalOpen}
        />
      )}
    </>
  );
};

const WorkoutSection: React.FC<{ title: string; description?: string; exercises: Exercise[] }> = ({ 
  title, 
  description, 
  exercises 
}) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      
      <Accordion type="single" collapsible className="w-full">
        {exercises.map((exercise, index) => (
          <AccordionItem key={exercise.id} value={exercise.id}>
            <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
              <div className="flex items-center">
                <span className="font-medium">{index + 1}. {exercise.name}</span>
                <Badge variant="lime" className="ml-3">
                  {exercise.duration}s {exercise.sets && `× ${exercise.sets}`}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ExerciseCard exercise={exercise} index={index} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export const LiftDetail: React.FC<LiftDetailProps> = ({ workout }) => {
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lift Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <div 
              className="relative h-48 w-full cursor-pointer"
              onClick={() => workout.videoUrl && setVideoModalOpen(true)}
            >
              <Image
                src={workout.imageUrl}
                alt={workout.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {workout.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary/80 rounded-full p-3 shadow-lg transform transition-transform hover:scale-110">
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
            
            <CardHeader>
              <CardTitle>{workout.title}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{workout.totalDuration} minutes total</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  <span>{workout.level.label} Level</span>
                </div>
                
                {workout.isTexasCardioDay && (
                  <div className="flex items-start mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                    <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Texas Cardio Day</p>
                      <p>Today focuses on massage techniques to boost circulation and give your facial muscles a break from lifting.</p>
                    </div>
                  </div>
                )}
                
                {workout.benefits && workout.benefits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="space-y-1">
                      {workout.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => workout.videoUrl && setVideoModalOpen(true)}
                disabled={!workout.videoUrl}
              >
                {workout.videoUrl ? 'Start Lift' : 'No Video Available'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Lift Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Steps</TabsTrigger>
              <TabsTrigger value="warm-up">Warm-Up</TabsTrigger>
              <TabsTrigger value="main">Main Lift</TabsTrigger>
              <TabsTrigger value="cool-down">Cool-Down</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-8 mt-6">
              <WorkoutSection 
                title={workout.sections.warmUp.title}
                description={workout.sections.warmUp.description}
                exercises={workout.sections.warmUp.exercises}
              />
              
              <WorkoutSection 
                title={workout.sections.mainWorkout.title}
                description={workout.sections.mainWorkout.description}
                exercises={workout.sections.mainWorkout.exercises}
              />
              
              <WorkoutSection 
                title={workout.sections.coolDown.title}
                description={workout.sections.coolDown.description}
                exercises={workout.sections.coolDown.exercises}
              />
            </TabsContent>
            
            <TabsContent value="warm-up" className="mt-6">
              <WorkoutSection 
                title={workout.sections.warmUp.title}
                description={workout.sections.warmUp.description}
                exercises={workout.sections.warmUp.exercises}
              />
            </TabsContent>
            
            <TabsContent value="main" className="mt-6">
              <WorkoutSection 
                title={workout.sections.mainWorkout.title}
                description={workout.sections.mainWorkout.description}
                exercises={workout.sections.mainWorkout.exercises}
              />
            </TabsContent>
            
            <TabsContent value="cool-down" className="mt-6">
              <WorkoutSection 
                title={workout.sections.coolDown.title}
                description={workout.sections.coolDown.description}
                exercises={workout.sections.coolDown.exercises}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
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
export const WorkoutDetail = LiftDetail;

export default LiftDetail; 