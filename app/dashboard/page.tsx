"use client";

// import { useWebSocket } from '@/contexts/WebSocketContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
// import { OnboardingTour } from '@/components/OnboardingTour';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Settings,
  PlusCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { getTodayWorkout, generateWeekOfWorkouts } from '@/utils/mockWorkouts';
import { DailyLiftCard } from '@/components/workouts/DailyWorkoutCard';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { WorkoutGallery, WorkoutSession, Exercise } from "@/components/ui/workout-gallery";

const AUTH_TIMEOUT = 15000; // 15 seconds

// Generate more realistic dummy data for the chart
const generateDummyData = () => {
  const data = [];
  const now = new Date();
  
  // Base values and growth factors
  let activeUsers = 120 + Math.floor(Math.random() * 50);
  let newUsers = 20 + Math.floor(Math.random() * 15);
  let engagementRate = 45 + Math.floor(Math.random() * 10);
  
  // Generate data for the past 90 days
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add weekly pattern (higher on weekdays, lower on weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.7 : 1.1;
    
    // Add some randomness
    const randomFactor = 0.85 + (Math.random() * 0.3);
    
    // Add growth trend over time (slight upward trend)
    const growthFactor = 1 + (i < 60 ? 0.002 : 0.001);
    
    // Calculate values for this day
    activeUsers = Math.max(100, Math.floor(activeUsers * growthFactor * randomFactor * weekendFactor));
    newUsers = Math.max(10, Math.floor(newUsers * randomFactor * weekendFactor));
    engagementRate = Math.min(95, Math.max(30, Math.floor(engagementRate * randomFactor * 0.99 + (Math.random() * 5 - 2))));
    
    // Add special events (spikes in activity)
    if (i === 30 || i === 60) {
      activeUsers = Math.floor(activeUsers * 1.5);
      newUsers = Math.floor(newUsers * 2);
    }
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    data.push({
      date: formattedDate,
      active: activeUsers,
      new: newUsers,
      engagement: engagementRate
    });
  }
  
  return data;
};

// Chart data for user activity
const chartData = generateDummyData();

// Calculate metrics from chart data
const calculateMetrics = () => {
  // Get the most recent 30 days of data
  const recentData = chartData.slice(-30);
  const previousData = chartData.slice(-60, -30);
  
  // Calculate totals for recent period
  const totalActiveUsers = recentData[recentData.length - 1].active;
  const totalNewUsers = recentData.reduce((sum, item) => sum + item.new, 0);
  const avgEngagement = Math.round(recentData.reduce((sum, item) => sum + item.engagement, 0) / recentData.length);
  
  // Calculate growth rates
  const prevActiveUsers = previousData[previousData.length - 1].active;
  const prevTotalNewUsers = previousData.reduce((sum, item) => sum + item.new, 0);
  const prevAvgEngagement = Math.round(previousData.reduce((sum, item) => sum + item.engagement, 0) / previousData.length);
  
  const activeGrowth = ((totalActiveUsers - prevActiveUsers) / prevActiveUsers) * 100;
  const newUsersGrowth = ((totalNewUsers - prevTotalNewUsers) / prevTotalNewUsers) * 100;
  const engagementGrowth = ((avgEngagement - prevAvgEngagement) / prevAvgEngagement) * 100;
  
  // Calculate progress percentages for radial charts (normalized to 0-100)
  const activeProgress = Math.min(100, Math.round((totalActiveUsers / 1000) * 100));
  const newUsersProgress = Math.min(100, Math.round((totalNewUsers / 1000) * 100));
  const engagementProgress = avgEngagement; // Already a percentage
  const revenueProgress = Math.min(100, Math.round((totalNewUsers * 19.99) / 200));
  
  return {
    activeUsers: {
      value: totalActiveUsers.toLocaleString(),
      change: activeGrowth.toFixed(1) + "%",
      trend: activeGrowth >= 0 ? "up" : "down",
      progress: activeProgress,
      label: "Active Users",
      fill: "var(--color-active)"
    },
    newUsers: {
      value: totalNewUsers.toLocaleString(),
      change: newUsersGrowth.toFixed(1) + "%",
      trend: newUsersGrowth >= 0 ? "up" : "down",
      progress: newUsersProgress,
      label: "New Signups",
      fill: "var(--color-new)"
    },
    engagement: {
      value: avgEngagement + "%",
      change: engagementGrowth.toFixed(1) + "%",
      trend: engagementGrowth >= 0 ? "up" : "down",
      progress: engagementProgress,
      label: "Engagement",
      fill: "var(--color-engagement)"
    },
    revenue: {
      value: "$" + (totalNewUsers * 19.99).toFixed(2) + "k",
      change: "+" + newUsersGrowth.toFixed(1) + "%",
      trend: "up",
      progress: revenueProgress,
      label: "Revenue",
      fill: "var(--color-revenue)"
    }
  };
};

const metrics = calculateMetrics();

// Dashboard metrics data for radial charts
const metricsChartData = [
  {
    metric: "activeUsers",
    visitors: metrics.activeUsers.progress,
    fill: "var(--color-active)",
    label: "Active Users",
    value: metrics.activeUsers.value,
    change: metrics.activeUsers.change,
    trend: metrics.activeUsers.trend
  },
  {
    metric: "newUsers",
    visitors: metrics.newUsers.progress,
    fill: "var(--color-new)",
    label: "New Signups",
    value: metrics.newUsers.value,
    change: metrics.newUsers.change,
    trend: metrics.newUsers.trend
  },
  {
    metric: "engagement",
    visitors: metrics.engagement.progress,
    fill: "var(--color-engagement)",
    label: "Engagement",
    value: metrics.engagement.value,
    change: metrics.engagement.change,
    trend: metrics.engagement.trend
  },
  {
    metric: "revenue",
    visitors: metrics.revenue.progress,
    fill: "var(--color-revenue)",
    label: "Est. Revenue",
    value: metrics.revenue.value,
    change: metrics.revenue.change,
    trend: metrics.revenue.trend
  }
];

// Chart config for radial charts
const radialChartConfig = {
  visitors: {
    label: "Value",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--primary))",
  },
  newUsers: {
    label: "New Signups",
    color: "hsl(var(--secondary))",
  },
  engagement: {
    label: "Engagement",
    color: "hsl(var(--accent))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig;

// Generate dynamic recent activity data
const generateRecentActivity = () => {
  const activities = [
    {
      type: "signup",
      action: "New user signup",
      icon: <PlusCircle className="h-4 w-4" />
    },
    {
      type: "payment",
      action: "Payment processed",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      type: "settings",
      action: "Settings updated",
      icon: <Settings className="h-4 w-4" />
    },
    {
      type: "session",
      action: "Session completed",
      icon: <Clock className="h-4 w-4" />
    },
    {
      type: "upgrade",
      action: "Plan upgraded",
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];
  
  const timeUnits = [
    { max: 10, unit: "minute", text: "minutes" },
    { max: 3, unit: "hour", text: "hours" },
    { max: 2, unit: "day", text: "days" }
  ];
  
  return Array.from({ length: 5 }, (_, i) => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    
    // Generate a random time
    const timeUnitIndex = Math.floor(Math.random() * timeUnits.length);
    const timeUnit = timeUnits[timeUnitIndex];
    const timeValue = Math.max(1, Math.floor(Math.random() * timeUnit.max));
    
    return {
      id: i + 1,
      action: activity.action,
      timestamp: `${timeValue} ${timeValue === 1 ? timeUnit.unit : timeUnit.text} ago`,
      icon: activity.icon
    };
  });
};

// Recent activity data
const recentActivity = generateRecentActivity();

const chartConfig = {
  users: {
    label: "Users",
  },
  active: {
    label: "Active Users",
    color: "hsl(var(--primary))",
  },
  new: {
    label: "New Users",
    color: "hsl(var(--secondary))",
  },
  engagement: {
    label: "Engagement Rate (%)",
    color: "hsl(var(--accent))",
  }
} satisfies ChartConfig;

export default function Dashboard() {
  
  // const { isConnected } = useWebSocket();
  // const [fullResponse, setFullResponse] = useState('');
  const { user, isSubscriber, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { subscription, fetchSubscription } = useSubscription();
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { isLoading: isTrialLoading, isInTrial } = useTrialStatus();
  const [timeRange, setTimeRange] = useState("30d");

  // Get today's workout
  const todayWorkout = getTodayWorkout();
  
  // Get a week of workouts for the gallery
  const weekWorkouts = generateWeekOfWorkouts();
  
  // Convert the workouts to the format expected by WorkoutGallery
  const galleryWorkouts: WorkoutSession[] = weekWorkouts.map(workout => {
    // Format the date
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(workout.date);
    
    // Collect all exercises from all sections
    const allExercises: Exercise[] = [
      ...workout.sections.warmUp.exercises,
      ...workout.sections.mainWorkout.exercises,
      ...workout.sections.coolDown.exercises
    ].map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: ex.sets || 1,
      reps: ex.repetitions || 1,
      weight: ex.category === 'main-workout' ? `${ex.duration}s` : undefined,
      isCompleted: false
    }));
    
    return {
      id: workout.id,
      date: formattedDate,
      title: workout.title,
      duration: `${workout.totalDuration} min`,
      calories: `${Math.floor(workout.totalDuration * 3.5)}`,
      exercises: allExercises,
      completed: false,
      imageUrl: workout.imageUrl,
      brief: workout.description.length > 120 ? 
        `${workout.description.substring(0, 120)}...` : 
        workout.description
    };
  });
  
  // State for tracking exercise completion
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(galleryWorkouts);
  
  // Handle toggling exercise completion
  const handleToggleExercise = (workoutId: string, exerciseId: string) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === workoutId 
        ? {
            ...workout,
            exercises: workout.exercises.map(exercise => 
              exercise.id === exerciseId 
                ? { ...exercise, isCompleted: !exercise.isCompleted }
                : exercise
            )
          }
        : workout
    ));
  };
  
  // Handle viewing workout details
  const handleViewDetails = (workoutId: string) => {
    router.push(`/workouts/${workoutId}`);
  };

  // Filter chart data based on selected time range
  const filteredChartData = (() => {
    switch (timeRange) {
      case "7d":
        return chartData.slice(-7);
      case "30d":
        return chartData.slice(-30);
      case "90d":
        return chartData;
      default:
        return chartData.slice(-30);
    }
  })();

  // First check - Auth check
  useEffect(() => {
    if (isAuthLoading || isTrialLoading) return;

    console.log('Access check isInTrial:', {
      hasSubscription: !!subscription,
      status: subscription?.status,
      isInTrial: isInTrial,
      validUntil: subscription?.current_period_end
    });

    if (!user) {
      router.replace('/login');
    }
  }, [user, router, isAuthLoading, isTrialLoading, subscription, isInTrial]);

  // Second check - Auth check
  useEffect(() => {
    if (isAuthLoading || isTrialLoading) return;

    console.log('Access check:', {
      isSubscriber,
      hasCheckedSubscription,
      isInTrial: isInTrial,
      authLoading: isAuthLoading,
    });

    if (!hasCheckedSubscription) {
      setHasCheckedSubscription(true);
      
      // Allow access for both subscribers and trial users
      if (!user || (!isSubscriber && !isInTrial && !isAuthLoading)) {
        console.log('No valid subscription or trial, redirecting');
        router.replace('/profile');
      }
    }
  }, [isSubscriber, isAuthLoading, hasCheckedSubscription, router, user, subscription, isTrialLoading, isInTrial]);

  // Add refresh effect
  useEffect(() => {
    const refreshSubscription = async () => {
      await fetchSubscription();
      setHasCheckedSubscription(true);
    };
    
    if (user?.id) {
      refreshSubscription();
    }
  }, [user?.id, fetchSubscription]);

  useEffect(() => {
    if (user?.id) {
      // Check if user has completed onboarding
      const checkOnboarding = async () => {
        const { data } = await supabase
          .from('user_preferences')
          .select('has_completed_onboarding')
          .eq('user_id', user.id)
          .single();
        
        setHasCompletedOnboarding(!!data?.has_completed_onboarding);
        console.log('hasCompletedOnboarding: ', hasCompletedOnboarding)
      };
      
      checkOnboarding();
    }
  }, [user?.id, hasCompletedOnboarding]);

  // Redirect if not authenticated
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthLoading && !user) {
        router.push('/login');
      }
    }, AUTH_TIMEOUT);

    return () => clearTimeout(timer);
  }, [user, isAuthLoading, isTrialLoading, router]);

  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserFirstName = () => {
    if (!user) return "";
    const email = user.email || "";
    return email.split("@")[0] || "there";
  };

  // Loading state
  if (isAuthLoading || isTrialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {getGreeting()}, {getUserFirstName()}
              </h2>
              <p className="text-muted-foreground mt-1">
                Welcome to your dashboard overview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lift Gallery Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-6">
          <WorkoutGallery
            workouts={workouts}
            onToggleExercise={handleToggleExercise}
            onViewDetails={handleViewDetails}
            title="Weekly Lift Plan"
            description="Track your facial fitness progress throughout the week"
          />
        </div>
      </div>

      {/* Methodology Highlight */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>MYFC Methodology</CardTitle>
            <CardDescription>
              Understanding the science behind your facial fitness routine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              The My Face Coach methodology is a comprehensive, science-based approach that mirrors traditional body fitness principles. 
              Designed to help you achieve a more youthful, lifted, and defined appearance.
            </p>
            
            <h3 className="font-medium text-sm mt-4">Today&apos;s Focus</h3>
            {todayWorkout.isTexasCardioDay ? (
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-medium text-sm">Texas Cardio Day</h4>
                <p className="text-xs mt-1">
                  Today focuses on massage techniques to boost circulation and give your facial muscles a break from lifting.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-3 rounded-md">
                <h4 className="font-medium text-sm">Full Facial Workout</h4>
                <p className="text-xs mt-1">
                  Today&apos;s lift includes all three steps: warm-up, lifts, and cool-down for a complete facial fitness routine.
                </p>
              </div>
            )}
            
            <Link href="/methodology">
              <Button variant="outline" className="w-full mt-2 text-xs" size="sm">
                Learn More <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Content */}
      <div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsChartData.map((metric, index) => (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader className="items-center pb-0">
                  <CardTitle>{metric.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={radialChartConfig}
                    className="mx-auto aspect-square max-h-[180px]"
                  >
                    <RadialBarChart
                      data={[metric]}
                      startAngle={0}
                      endAngle={250}
                      innerRadius={60}
                      outerRadius={80}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[65, 55]}
                      />
                      <RadialBar dataKey="visitors" background cornerRadius={10} />
                      <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    {metric.value}
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-1 text-sm pt-0">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    <span className={metric.trend === 'up' ? 'text-primary' : 'text-destructive'}>
                      {metric.trend === 'up' ? 'Trending up' : 'Trending down'} by {metric.change}
                    </span>
                    <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-primary' : 'text-destructive'} ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    Active users, new signups, and engagement metrics
                  </CardDescription>
                </div>
                <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger
                    className="w-[160px] rounded-lg"
                    aria-label="Select time range"
                  >
                    <SelectValue placeholder="Last 30 days" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="7d" className="rounded-lg">
                      Last 7 days
                    </SelectItem>
                    <SelectItem value="30d" className="rounded-lg">
                      Last 30 days
                    </SelectItem>
                    <SelectItem value="90d" className="rounded-lg">
                      Last 3 months
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[300px] w-full"
                >
                  <AreaChart data={filteredChartData}>
                    <defs>
                      <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-active)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-active)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-new)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-new)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-engagement)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-engagement)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            });
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="new"
                      type="natural"
                      fill="url(#fillNew)"
                      stroke="var(--color-new)"
                      stackId="a"
                    />
                    <Area
                      dataKey="active"
                      type="natural"
                      fill="url(#fillActive)"
                      stroke="var(--color-active)"
                      stackId="a"
                    />
                    <Area
                      dataKey="engagement"
                      type="monotone"
                      stroke="var(--color-engagement)"
                      strokeWidth={2}
                      dot={{ r: 2, strokeWidth: 2, fill: "var(--background)" }}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      fill="none"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 text-sm"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="font-medium">
                          {activity.action}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {activity.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}