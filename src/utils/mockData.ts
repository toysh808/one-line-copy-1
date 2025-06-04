
import { Line } from '@/types';
import { getLineOfTheDayFromDB } from './seedData';

const SAMPLE_TEXTS = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Be yourself; everyone else is already taken.",
  "Life is what happens to you while you're busy making other plans.",
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Stay hungry, stay foolish.",
  "I just heard about this new coffee shop downtown and it's really amazing!",
  "Monday motivation: small steps lead to big changes over time.",
  "Debugging code at 2 AM hits different than debugging during normal hours.",
  "Why do we park in driveways and drive on parkways? Life's mysteries.",
  "That feeling when your code works on the first try is unmatched.",
  "Rainy days are perfect for reading and hot chocolate by the window.",
  "Sometimes the best conversations happen with strangers on long flights.",
  "The secret to happiness might just be finding joy in ordinary moments.",
  "Technology is amazing but nothing beats face-to-face human connection.",
  "Morning runs teach you that your body can do more than your mind thinks.",
  "The older I get, the more I appreciate simple pleasures like good food.",
  "Social media makes the world smaller but sometimes I miss the mystery.",
  "Learning a new language opens doors to understanding different cultures.",
  "The best advice often comes from people who've made similar mistakes.",
  "Gardening teaches patience in a world that demands instant everything.",
  "Music has this incredible power to transport you back to specific moments."
];

const SAMPLE_USERNAMES = [
  "moonlight_dreamer", "coffee_addict", "book_worm", "wanderlust_soul",
  "pixel_artist", "ocean_breeze", "mountain_hiker", "city_explorer",
  "code_ninja", "sunset_chaser", "rain_lover", "star_gazer",
  "music_maven", "food_critic", "nature_photographer", "tech_enthusiast",
  "vintage_collector", "fitness_guru", "poetry_writer", "travel_blogger",
  "game_developer", "design_thinker", "mindful_living", "creative_spark",
  "night_owl", "early_bird", "adventure_seeker", "peaceful_mind",
  "curious_learner", "kind_soul", "brave_heart", "free_spirit"
];

export const generateMockLines = (): Line[] => {
  const lines: Line[] = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 32; i++) {
    const randomTime = new Date(
      sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime())
    );
    
    lines.push({
      id: `line_${i + 1}`,
      text: SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)],
      author: SAMPLE_USERNAMES[Math.floor(Math.random() * SAMPLE_USERNAMES.length)],
      authorId: `user_${Math.floor(Math.random() * 32) + 1}`,
      likes: Math.floor(Math.random() * 31),
      timestamp: randomTime,
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.8
    });
  }

  return lines.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getLineOfTheDay = async (): Promise<Line> => {
  // Try to get the actual line of the day from the database
  const lineFromDB = await getLineOfTheDayFromDB();
  
  if (lineFromDB) {
    return lineFromDB;
  }

  // Fallback to static line if database is empty
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
