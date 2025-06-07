
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UserReview } from '@/types';

interface ReviewCardProps {
  review: UserReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="relative p-4 hover:shadow-md transition-shadow animate-fade-in bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
      
      <div className="space-y-3">
        <p className="text-base leading-relaxed font-medium">{review.lines}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-600">{review.name}</span>
            <span>·</span>
            <span>{formatDate(review.date)}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Review</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              <ArrowUp className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium">{review.votes}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
