import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names
 * Combines clsx for conditional classes with string concatenation
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
