
import { Line } from '@/types';
import { getLineOfTheDayFromDB } from './seedData';

export const generateMockLines = (): Line[] => {
  // Return empty array - no more mock data
  return [];
};

export const getLineOfTheDay = async (): Promise<Line> => {
  // Try to get the actual line of the day from the database
  const lineFromDB = await getLineOfTheDayFromDB();
  
  if (lineFromDB) {
    return lineFromDB;
  }

  // Fallback to static line if database is empty (as requested)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    id: "line_of_the_day",
    text: "Every day is a new opportunity to write your story, one line at a time.",
    author: "oneline_official",
    authorId: "official_1",
    likes: 247,
    timestamp: yesterday,
    isLiked: false,
    isBookmarked: false
  };
};
