
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
