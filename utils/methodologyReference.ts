/**
 * Utility functions for referencing the MYFC Methodology document
 * This can be used to maintain consistent references to methodology concepts
 * throughout the application
 */

export interface MethodologyReference {
  title: string;
  description: string;
  documentUrl: string;
}

// This object can be expanded with actual sections and concepts from the methodology
// as you reference them in the application
export const methodologyConcepts: Record<string, MethodologyReference> = {
  // Example concepts - replace with actual concepts from your methodology
  overview: {
    title: "MYFC Methodology Overview",
    description: "The foundational principles and approach of the MYFC methodology.",
    documentUrl: "/MYFC _ The Methodology.pdf"
  },
  // Add more concepts as needed
};

/**
 * Get a reference to a specific methodology concept
 * @param conceptKey The key of the concept to reference
 * @returns The methodology reference object
 */
export function getMethodologyReference(conceptKey: string): MethodologyReference | undefined {
  return methodologyConcepts[conceptKey];
}

/**
 * Get the URL to the methodology document
 * @returns The URL to the methodology document
 */
export function getMethodologyDocumentUrl(): string {
  return "/MYFC _ The Methodology.pdf";
}

/**
 * Open the methodology document in a new tab
 */
export function openMethodologyDocument(): void {
  if (typeof window !== 'undefined') {
    window.open(getMethodologyDocumentUrl(), '_blank');
  }
}

export default {
  getMethodologyReference,
  getMethodologyDocumentUrl,
  openMethodologyDocument,
  methodologyConcepts
}; 