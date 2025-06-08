
import React, { useState, useEffect, useCallback } from 'react';
import { LineCard } from './LineCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Line } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LineFeedProps {
  dateFilter?: string;
  refreshTrigger?: number;
}

export const LineFeed: React.FC<LineFeedProps> = ({ dateFilter, refreshTrigger }) => {
  const { user } = useAuth();
  const [lines, setLines] = useState<Line[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const LINES_PER_PAGE = 15;

  useEffect(() => {
    // Reset state when dateFilter or refreshTrigger changes
    setLines([]);
    setOffset(0);
    setHasMore(true);
    loadLines(true);
  }, [dateFilter, refreshTrigger]);

  const loadLines = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const currentOffset = isInitialLoad ? 0 : offset;
      
      let query = supabase
        .from('lines')
        .select(`
          *,
          likes(user_id),
          bookmarks(user_id)
        `)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + LINES_PER_PAGE - 1);

      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999)).toISOString();
        
        query = query
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay);
      }

      const { data: linesData, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!linesData || linesData.length === 0) {
        if (isInitialLoad) {
          setLines([]);
        }
        setHasMore(false);
        return;
      }

      // Fetch profile data separately to avoid relationship issues
      const authorIds = [...new Set(linesData.map(line => line.author_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', authorIds);

      if (profilesError) {
        console.error('Profiles query error:', profilesError);
        throw profilesError;
      }

      // Create a map of author IDs to usernames
      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile.username]) || []);

      // Transform the data to match our Line interface
      const transformedLines: Line[] = linesData.map(line => ({
        id: line.id,
        text: line.text,
        author: profilesMap.get(line.author_id) || 'Unknown',
        authorId: line.author_id,
        likes: line.likes_count || 0,
        timestamp: new Date(line.created_at),
        isLiked: user ? line.likes.some((like: any) => like.user_id === user.id) : false,
        isBookmarked: user ? line.bookmarks.some((bookmark: any) => bookmark.user_id === user.id) : false
      }));

      if (isInitialLoad) {
        setLines(transformedLines);
        setOffset(LINES_PER_PAGE);
      } else {
        setLines(prev => [...prev, ...transformedLines]);
        setOffset(prev => prev + LINES_PER_PAGE);
      }
      
      // Check if we have more content
      setHasMore(transformedLines.length === LINES_PER_PAGE);
    } catch (error) {
      console.error('Error loading lines:', error);
      if (isInitialLoad) {
        setLines([]);
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !dateFilter) {
      loadLines(false);
    }
  }, [isLoadingMore, hasMore, dateFilter, offset]);

  const handleLineUpdate = async (updatedLine: Line) => {
    if (!user) return;

    try {
      if (updatedLine.isLiked !== lines.find(l => l.id === updatedLine.id)?.isLiked) {
        if (updatedLine.isLiked) {
          await supabase.from('likes').insert({
            line_id: updatedLine.id,
            user_id: user.id
          });
        } else {
          await supabase.from('likes').delete()
            .eq('line_id', updatedLine.id)
            .eq('user_id', user.id);
        }
      }

      if (updatedLine.isBookmarked !== lines.find(l => l.id === updatedLine.id)?.isBookmarked) {
        if (updatedLine.isBookmarked) {
          await supabase.from('bookmarks').insert({
            line_id: updatedLine.id,
            user_id: user.id
          });
        } else {
          await supabase.from('bookmarks').delete()
            .eq('line_id', updatedLine.id)
            .eq('user_id', user.id);
        }
      }

      setLines(prev => prev.map(line => 
        line.id === updatedLine.id ? updatedLine : line
      ));
    } catch (error) {
      console.error('Error updating line interaction:', error);
    }
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
      
      {hasMore && !dateFilter && (
        <div className="text-center py-4">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      
      {!hasMore && lines.length > 0 && !dateFilter && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">You've reached the end!</p>
        </div>
      )}
    </div>
  );
};
