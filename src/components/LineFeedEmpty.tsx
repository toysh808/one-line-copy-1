
import React from 'react';

interface LineFeedEmptyProps {
  dateFilter?: string;
}

export const LineFeedEmpty: React.FC<LineFeedEmptyProps> = ({ dateFilter }) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-lg">
        {dateFilter 
          ? `No lines found for ${new Date(dateFilter).toLocaleDateString()}`
          : "No lines found. Be the first to share a line!"
        }
      </p>
      {dateFilter && (
        <p className="text-sm text-muted-foreground mt-2">
          Try selecting a different date or check back later
        </p>
      )}
    </div>
  );
};
