
import React, { useState, useEffect } from 'react';
import { LineCard } from './LineCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Line } from '@/types';
import { generateMockLines } from '@/utils/mockData';

interface LineFeedProps {
  dateFilter?: string;
}

export const LineFeed: React.FC<LineFeedProps> = ({ dateFilter }) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadLines();
  }, [dateFilter]);

  const loadLines = async () => {
    setIsLoading(true);
    
    // Simulate API loading
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let allLines = generateMockLines();
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
      
      allLines = allLines.filter(line => 
        line.timestamp >= startOfDay && line.timestamp <= endOfDay
      );
    }
    
    setLines(allLines);
    setIsLoading(false);
    setHasMore(allLines.length >= 20);
  };

  const handleLineUpdate = (updatedLine: Line) => {
    setLines(prev => prev.map(line => 
      line.id === updatedLine.id ? updatedLine : line
    ));
  };

  if (isLoading) {
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
  }

  if (lines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {dateFilter 
            ? `No lines found for ${new Date(dateFilter).toLocaleDateString()}`
            : "No lines found"
          }
        </p>
        {dateFilter && (
          <p className="text-sm text-muted-foreground mt-2">
            Try selecting a different date or check back later
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dateFilter && (
        <div className="text-center py-4 border-b">
          <p className="text-sm text-muted-foreground">
            Showing lines from {new Date(dateFilter).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
      
      {lines.map((line) => (
        <LineCard 
          key={line.id} 
          line={line} 
          onUpdate={handleLineUpdate}
        />
      ))}
      
      {hasMore && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Loading more lines...</p>
        </div>
      )}
    </div>
  );
};
