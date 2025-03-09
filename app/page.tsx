"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingScreen } from "@/components/OnboardingScreen";
import { QuestionnaireScreen } from "@/components/QuestionnaireScreen";
import { FacialAreaScreen } from "@/components/FacialAreaScreen";
import { TimeSelectionScreen } from "@/components/TimeSelectionScreen";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [facialAreaComplete, setFacialAreaComplete] = useState(false);
  const [timeSelectionComplete, setTimeSelectionComplete] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [facialAreas, setFacialAreas] = useState<string[]>([]);
  const [timePreference, setTimePreference] = useState<{ period: string; time: string } | null>(null);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
    
    // Simulate content loading
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 500); // Short delay to ensure content is ready
    
    return () => clearTimeout(timer);
  }, []);

  // Handle loading screen completion
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  // Handle questionnaire completion
  const handleQuestionnaireComplete = (selectedOptions: string[]) => {
    setUserPreferences(selectedOptions);
    setQuestionnaireComplete(true);
    
    // Log the selected preferences (can be used later for personalization)
    console.log("User preferences:", selectedOptions);
  };

  // Handle facial area selection completion
  const handleFacialAreaComplete = (selectedAreas: string[]) => {
    setFacialAreas(selectedAreas);
    setFacialAreaComplete(true);
    
    // Log the selected facial areas (can be used later for personalization)
    console.log("Selected facial areas:", selectedAreas);
  };

  // Handle time selection completion
  const handleTimeSelectionComplete = (preference: { period: string; time: string }) => {
    setTimePreference(preference);
    setTimeSelectionComplete(true);
    
    // Log the selected time preference (can be used later for personalization)
    console.log("Time preference:", preference);
  };

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <>
      {/* Loading Screen */}
      {!loadingComplete && (
        <LoadingScreen 
          minimumLoadTimeMs={2000}
          onComplete={handleLoadingComplete}
        />
      )}
      
      {/* Onboarding Screen - shown after loading */}
      {loadingComplete && !onboardingComplete && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      
      {/* Questionnaire Screen - shown after onboarding */}
      {loadingComplete && onboardingComplete && !questionnaireComplete && (
        <QuestionnaireScreen onComplete={handleQuestionnaireComplete} />
      )}
      
      {/* Facial Area Screen - shown after questionnaire */}
      {loadingComplete && onboardingComplete && questionnaireComplete && !facialAreaComplete && (
        <FacialAreaScreen onComplete={handleFacialAreaComplete} />
      )}
      
      {/* Time Selection Screen - shown after facial area selection */}
      {loadingComplete && onboardingComplete && questionnaireComplete && facialAreaComplete && !timeSelectionComplete && (
        <TimeSelectionScreen onComplete={handleTimeSelectionComplete} />
      )}
      
      {/* Main Content - only shown after all onboarding steps are complete */}
      {loadingComplete && onboardingComplete && questionnaireComplete && facialAreaComplete && timeSelectionComplete && (
        <div className="grid min-h-svh lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-xs">
                <div className="flex justify-center mb-8">
                  {mounted && (
                    <Image
                      src={(theme === 'dark' || resolvedTheme === 'dark') 
                        ? "/MYFC_logo_white.png" 
                        : "/MYFC_logo.png"}
                      alt="MYFC Logo"
                      width={100}
                      height={100}
                      priority
                    />
                  )}
                </div>
                <LoginForm />
              </div>
            </div>
          </div>
          <div className="relative hidden bg-muted lg:block">
            <Image
              src="/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg"
              alt="Login background"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>
      )}
    </>
  );
}

