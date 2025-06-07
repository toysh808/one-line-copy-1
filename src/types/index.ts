
export interface Line {
  id: string;
  text: string;
  author: string;
  authorId: string;
  likes: number;
  timestamp: Date;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserReview {
  id: string;
  name: string;
  date: string;
  lines: string;
  votes: number;
  created_at: string;
}
