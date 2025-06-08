
import React from 'react';
import { LineCard } from './LineCard';
import { LineFeedSkeleton } from './LineFeedSkeleton';
import { LineFeedEmpty } from './LineFeedEmpty';
import { LineFeedLoadingIndicator } from './LineFeedLoadingIndicator';
import { useLineFeed } from '@/hooks/useLineFeed';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface LineFeedProps {
  dateFilter?: string;
  refreshTrigger?: number;
}

export const LineFeed: React.FC<LineFeedProps> = ({ dateFilter, refreshTrigger }) => {
  const {
    lines,
    isLoading,
    isLoadingMore,
    hasMore,
    loadLines,
    handleLineUpdate
  } = useLineFeed({ dateFilter, refreshTrigger });

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    isLoading,
    dateFilter,
    onLoadMore: () => loadLines(false)
  });

  if (isLoading) {
    return <LineFeedSkeleton />;
  }

  if (lines.length === 0) {
    return <LineFeedEmpty dateFilter={dateFilter} />;
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
      
      {/* Infinite scroll trigger - only for non-filtered feeds */}
      {!dateFilter && (
        <div ref={loadMoreRef} className="text-center py-4">
          <LineFeedLoadingIndicator 
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            linesCount={lines.length}
          />
        </div>
      )}
    </div>
  );
};
