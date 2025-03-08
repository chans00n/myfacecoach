import { Exercise, Workout, WORKOUT_LEVELS, ExerciseType, ExerciseCategory, FacialArea } from "@/types/workout";

// Mock exercises for different categories
const mockWarmUpExercises: Exercise[] = [
  {
    id: "wu-1",
    name: "Gentle Lymph Drainage",
    description: "A gentle massage technique to stimulate lymphatic flow and reduce puffiness.",
    type: "lymph-drainage" as ExerciseType,
    category: "warm-up" as ExerciseCategory,
    targetArea: ["full-face"] as FacialArea[],
    duration: 60, // 1 minute
    instructions: [
      "Start at the center of your face",
      "Use light, gentle pressure with your fingertips",
      "Move outward in sweeping motions",
      "Repeat 3-5 times"
    ],
    tips: ["Keep pressure very light", "Focus on smooth, flowing movements"],
    imageUrl: "/images/dane-wetton-Raqd-o35Es4-unsplash.jpg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "wu-2",
    name: "Facial Wake-Up Massage",
    description: "Energizing massage to increase blood flow and prepare muscles for exercise.",
    type: "massage" as ExerciseType,
    category: "warm-up" as ExerciseCategory,
    targetArea: ["cheeks", "jawline"] as FacialArea[],
    duration: 90, // 1.5 minutes
    instructions: [
      "Apply facial oil or moisturizer",
      "Use upward circular motions on cheeks",
      "Gently knead along the jawline",
      "Finish with upward strokes"
    ],
    tips: ["Use your knuckles for deeper pressure on the jawline"],
    imageUrl: "/images/reza-shayestehpour-Nw_D8v79PM4-unsplash.jpg"
  }
];

const mockMainWorkoutExercises: Exercise[] = [
  {
    id: "mw-1",
    name: "Forehead Lifter",
    description: "Strengthens the frontalis muscle to lift and tone the forehead area.",
    type: "lift" as ExerciseType,
    category: "main-workout" as ExerciseCategory,
    targetArea: ["forehead", "brows"] as FacialArea[],
    duration: 45, // 45 seconds
    repetitions: 10,
    sets: 3,
    instructions: [
      "Place fingertips at the hairline",
      "Apply gentle resistance",
      "Raise eyebrows against resistance",
      "Hold for 5 seconds",
      "Release and repeat"
    ],
    tips: ["Keep your neck relaxed", "Focus on the sensation in your forehead muscles"],
    imageUrl: "/images/brut-carniollus-jGEsapFCLgw-unsplash.jpg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "mw-2",
    name: "Cheek Volumizer",
    description: "Targets the cheek muscles to enhance volume and lift in the mid-face.",
    type: "lift" as ExerciseType,
    category: "main-workout" as ExerciseCategory,
    targetArea: ["cheeks"] as FacialArea[],
    duration: 60, // 1 minute
    repetitions: 12,
    sets: 3,
    instructions: [
      "Smile with lips closed",
      "Place fingertips on the highest point of your cheeks",
      "Apply gentle resistance",
      "Lift cheeks against resistance",
      "Hold for 5 seconds",
      "Release and repeat"
    ],
    tips: ["Think about lifting from the center of your face outward"],
    imageUrl: "/images/michael-afonso-dT_48mv268I-unsplash.jpg"
  },
  {
    id: "mw-3",
    name: "Jawline Definer",
    description: "Strengthens the muscles along the jawline for improved definition.",
    type: "lift" as ExerciseType,
    category: "main-workout" as ExerciseCategory,
    targetArea: ["jawline"] as FacialArea[],
    duration: 60, // 1 minute
    repetitions: 15,
    sets: 2,
    instructions: [
      "Tilt head slightly back",
      "Press tongue to roof of mouth",
      "Slowly open and close mouth while maintaining pressure",
      "Feel the contraction along the jawline"
    ],
    tips: ["Keep shoulders relaxed", "Focus on controlled movements"],
    imageUrl: "/images/alexander-krivitskiy-29iRkbuiOfo-unsplash.jpg"
  },
  {
    id: "mw-4",
    name: "Facial Core Stabilizer",
    description: "A core exercise that strengthens the central facial muscles for overall stability.",
    type: "lift" as ExerciseType,
    category: "main-workout" as ExerciseCategory,
    targetArea: ["facial-core", "lips"] as FacialArea[],
    duration: 45, // 45 seconds
    repetitions: 10,
    sets: 3,
    instructions: [
      "Purse lips together",
      "Pull corners of mouth inward",
      "Hold for 5 seconds while maintaining tension",
      "Release and repeat"
    ],
    tips: ["Think about drawing energy to the center of your face"],
    imageUrl: "/images/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg"
  }
];

const mockCoolDownExercises: Exercise[] = [
  {
    id: "cd-1",
    name: "Facial Relaxation Stretch",
    description: "Gentle stretches to release tension and promote recovery.",
    type: "stretch" as ExerciseType,
    category: "cool-down" as ExerciseCategory,
    targetArea: ["full-face"] as FacialArea[],
    duration: 60, // 1 minute
    instructions: [
      "Open mouth wide",
      "Stretch all facial muscles",
      "Hold for 10 seconds",
      "Release and repeat 3 times"
    ],
    tips: ["Breathe deeply while stretching", "Feel the release of tension"],
    imageUrl: "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "cd-2",
    name: "Calming Facial Massage",
    description: "Soothing massage to promote circulation and relaxation after exercise.",
    type: "massage" as ExerciseType,
    category: "cool-down" as ExerciseCategory,
    targetArea: ["full-face", "neck"] as FacialArea[],
    duration: 90, // 1.5 minutes
    instructions: [
      "Apply facial oil or moisturizer",
      "Use gentle downward strokes",
      "Pay special attention to areas that feel tight",
      "Finish with light tapping motions"
    ],
    tips: ["Use this time to practice mindfulness", "Focus on your breathing"],
    imageUrl: "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
  }
];

// Create a mock workout
export const createMockWorkout = (
  id: string,
  title: string,
  level: 'basic' | 'intermediate' | 'advanced',
  isTexasCardioDay: boolean = false,
  date: Date = new Date()
): Workout => {
  // For Texas Cardio days, we only include warm-up and cool-down exercises with more massage
  const mainExercises: Exercise[] = isTexasCardioDay 
    ? [
        {
          id: "tc-1",
          name: "Deep Facial Massage",
          description: "Intensive massage to boost circulation and give muscles a break from lifting.",
          type: "massage" as ExerciseType,
          category: "texas-cardio" as ExerciseCategory,
          targetArea: ["full-face"] as FacialArea[],
          duration: 300, // 5 minutes
          instructions: [
            "Apply facial oil",
            "Use firm, circular motions",
            "Work from center outward",
            "Pay attention to all facial zones"
          ],
          tips: ["Take your time", "Adjust pressure based on comfort"],
          imageUrl: "/images/chad-madden-1z6JYPafvII-unsplash.jpg"
        }
      ]
    : mockMainWorkoutExercises;

  // Calculate durations
  const warmUpDuration = mockWarmUpExercises.reduce((total, ex) => total + ex.duration, 0) / 60;
  const mainWorkoutDuration = mainExercises.reduce((total, ex) => {
    return total + (ex.duration * (ex.sets || 1));
  }, 0) / 60;
  const coolDownDuration = mockCoolDownExercises.reduce((total, ex) => total + ex.duration, 0) / 60;
  
  const totalDuration = Math.ceil(warmUpDuration + mainWorkoutDuration + coolDownDuration);

  // Select an appropriate image based on the workout type
  const getWorkoutImage = () => {
    if (isTexasCardioDay) {
      return "/images/chad-madden-1z6JYPafvII-unsplash.jpg";
    }
    
    // Rotate through different images based on the day of the week
    const images = [
      "/images/seth-doyle-kqf4hj0cLwI-unsplash.jpg",
      "/images/zulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg",
      "/images/serge-le-strat-QkMqoLwhdnY-unsplash.jpg",
      "/images/yusuf-evli-DjQx057gBC0-unsplash.jpg",
      "/images/mathilde-langevin-NWEKGZ5B2q0-unsplash.jpg"
    ];
    
    const dayOfWeek = date.getDay();
    return images[dayOfWeek % images.length];
  };

  // Select an appropriate video based on the workout type
  const getWorkoutVideo = () => {
    if (isTexasCardioDay) {
      return "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
    }
    
    // Different videos for different days
    const videos = [
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    ];
    
    const dayOfWeek = date.getDay();
    return videos[dayOfWeek % videos.length];
  };

  return {
    id,
    title,
    description: isTexasCardioDay 
      ? "A special Texas Cardio day focused on massage techniques to boost circulation and give your facial muscles a break from lifting."
      : "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    imageUrl: getWorkoutImage(),
    videoUrl: getWorkoutVideo(),
    date,
    level: WORKOUT_LEVELS.find(l => l.value === level) || WORKOUT_LEVELS[0],
    isTexasCardioDay,
    totalDuration,
    sections: {
      warmUp: {
        title: "Warm-Up",
        description: "Prepare your facial muscles with gentle lymph drainage and massage.",
        exercises: mockWarmUpExercises,
        duration: warmUpDuration
      },
      mainWorkout: {
        title: isTexasCardioDay ? "Texas Cardio" : "Main Workout",
        description: isTexasCardioDay 
          ? "Focus on massage techniques to boost circulation."
          : "Strengthen and tone your facial muscles with targeted exercises.",
        exercises: mainExercises,
        duration: mainWorkoutDuration
      },
      coolDown: {
        title: "Cool-Down",
        description: "Relax and recover with gentle stretches and soothing massage.",
        exercises: mockCoolDownExercises,
        duration: coolDownDuration
      }
    },
    benefits: [
      "Improved facial muscle tone",
      "Enhanced circulation",
      "Reduced tension",
      "Natural lifting effect"
    ]
  };
};

// Generate a week of workouts
export const generateWeekOfWorkouts = (): Workout[] => {
  const today = new Date();
  const workouts: Workout[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i); // Start from Sunday of current week
    
    // Make Tuesday and Friday Texas Cardio days
    const isTexasCardioDay = date.getDay() === 2 || date.getDay() === 5;
    
    // Alternate difficulty levels
    let level: 'basic' | 'intermediate' | 'advanced';
    if (i % 3 === 0) level = 'basic';
    else if (i % 3 === 1) level = 'intermediate';
    else level = 'advanced';
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const title = isTexasCardioDay 
      ? `Texas Cardio ${dayNames[date.getDay()]}`
      : `${dayNames[date.getDay()]} Facial Fitness`;
    
    workouts.push(createMockWorkout(`workout-${i+1}`, title, level, isTexasCardioDay, date));
  }
  
  return workouts;
};

// Get today's workout
export const getTodayWorkout = (): Workout => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isTexasCardioDay = dayOfWeek === 2 || dayOfWeek === 5; // Tuesday or Friday
  
  let level: 'basic' | 'intermediate' | 'advanced';
  if (dayOfWeek % 3 === 0) level = 'basic';
  else if (dayOfWeek % 3 === 1) level = 'intermediate';
  else level = 'advanced';
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const title = isTexasCardioDay 
    ? `Texas Cardio ${dayNames[dayOfWeek]}`
    : `${dayNames[dayOfWeek]} Facial Fitness`;
  
  return createMockWorkout('today-workout', title, level, isTexasCardioDay, today);
}; 