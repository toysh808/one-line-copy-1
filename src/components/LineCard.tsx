
import React, { useState } from 'react';
import { ArrowUp, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Line } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LineCardProps {
  line: Line;
  onUpdate: (updatedLine: Line) => void;
}

export const LineCard: React.FC<LineCardProps> = ({ line: initialLine, onUpdate }) => {
  const { user } = useAuth();
  const [line, setLine] = useState(initialLine);
  const [showTimestamp, setShowTimestamp] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like lines.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedLine = {
      ...line,
      isLiked: !line.isLiked,
      likes: line.isLiked ? line.likes - 1 : line.likes + 1
    };
    
    setLine(updatedLine);
    onUpdate(updatedLine);
    
    // Remove focus after action
    (e.target as HTMLElement).blur();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark lines.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedLine = {
      ...line,
      isBookmarked: !line.isBookmarked
    };
    
    setLine(updatedLine);
    onUpdate(updatedLine);
    
    toast({
      title: line.isBookmarked ? "Bookmark removed" : "Bookmarked!",
      description: line.isBookmarked ? "Line removed from bookmarks" : "Line saved to bookmarks"
    });
    
    // Remove focus after action
    (e.target as HTMLElement).blur();
  };

  const handleCardClick = () => {
    setShowTimestamp(!showTimestamp);
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <TooltipProvider>
      <Card 
        className="relative p-4 hover:shadow-md transition-shadow animate-fade-in cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-border hover:bg-primary/50 transition-colors z-10" />
        
        <div className="space-y-3">
          <p className="text-base leading-relaxed">{line.text}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>@{line.author}</span>
              <span>·</span>
              <span>{timeAgo(line.timestamp)}</span>
            </div>
            
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`h-8 px-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:ring-0 active:scale-95 ${
                      line.isLiked 
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                        : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <ArrowUp className={`h-4 w-4 mr-1 transition-all duration-200 ${
                      line.isLiked ? 'fill-current stroke-2' : 'stroke-2'
                    }`} />
                    {line.likes}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{line.isLiked ? 'Unlike' : 'Like'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={`h-8 w-8 p-0 rounded-full transition-all duration-200 focus:outline-none focus:ring-0 focus-visible:ring-0 active:scale-95 ${
                      line.isBookmarked 
                        ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' 
                        : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 transition-all duration-200 ${
                      line.isBookmarked ? 'fill-current' : ''
                    }`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{line.isBookmarked ? 'Remove bookmark' : 'Bookmark'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {showTimestamp && (
            <div className="pt-2 border-t animate-fade-in">
              <p className="text-xs text-muted-foreground">
                {line.timestamp.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
};
