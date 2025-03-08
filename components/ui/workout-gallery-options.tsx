/**
 * Workout Gallery Aspect Ratio Options
 * 
 * This file contains examples of different aspect ratios you can use for the workout cards.
 * You can choose the one that best fits your design and content.
 */

// Option 1: 16:9 (Widescreen) - Good for landscape images
// <AspectRatio ratio={16 / 9} className="bg-muted">

// Option 2: 4:3 (Standard) - More traditional, less wide
// <AspectRatio ratio={4 / 3} className="bg-muted">

// Option 3: 3:2 (Classic Photography) - Balanced ratio
// <AspectRatio ratio={3 / 2} className="bg-muted">

// Option 4: 1:1 (Square) - Equal width and height
// <AspectRatio ratio={1 / 1} className="bg-muted">

// Option 5: 2:3 (Portrait) - Taller than wide, good for person-focused images
// <AspectRatio ratio={2 / 3} className="bg-muted">

// Option 6: 9:16 (Vertical Video) - Very tall, like mobile video
// <AspectRatio ratio={9 / 16} className="bg-muted">

// Option 7: 21:9 (Ultrawide) - Very wide, cinematic feel
// <AspectRatio ratio={21 / 9} className="bg-muted">

/**
 * How to use:
 * 
 * 1. Choose the aspect ratio that best fits your content
 * 2. Replace the ratio value in the workout-gallery.tsx file
 * 3. Adjust the image positioning if needed
 * 
 * Example:
 * <AspectRatio ratio={16 / 9} className="bg-muted">
 *   <div className="relative w-full h-full">
 *     <Image
 *       src={workout.imageUrl}
 *       alt={workout.title}
 *       fill
 *       className="object-cover transition-transform group-hover:scale-105"
 *     />
 *   </div>
 * </AspectRatio>
 */ 