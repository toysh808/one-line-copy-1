
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LineFeedSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-3 p-4 border rounded-lg">
          <Skeleton className="h-4 w-full animate-pulse-soft" />
          <Skeleton className="h-4 w-3/4 animate-pulse-soft" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20 animate-pulse-soft" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12 animate-pulse-soft" />
              <Skeleton className="h-6 w-6 animate-pulse-soft" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
