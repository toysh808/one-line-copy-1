
import React, { useState } from 'react';
import { ArrowUp, Bookmark, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { getLineOfTheDay } from '@/utils/mockData';
import { toast } from '@/hooks/use-toast';

export const LineOfTheDay: React.FC = () => {
  const { user } = useAuth();
  const [line, setLine] = useState(() => getLineOfTheDay());
  const [showTimestamp, setShowTimestamp] = useState(false);

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like lines.",
        variant: "destructive"
      });
      return;
    }
    
    setLine(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark lines.",
        variant: "destructive"
      });
      return;
    }
    
    setLine(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
    
    toast({
      title: line.isBookmarked ? "Bookmark removed" : "Bookmarked!",
      description: line.isBookmarked ? "Line removed from bookmarks" : "Line saved to bookmarks"
    });
  };

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-fade-in">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 hover:bg-white/50 transition-colors cursor-pointer"
             onClick={() => setShowTimestamp(!showTimestamp)} />
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium text-white/90">Line of the Day</span>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">{line.text}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">@{line.author}</span>
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`text-white hover:bg-white/10 ${line.isLiked ? 'text-red-300' : ''}`}
                    >
                      <ArrowUp className={`h-4 w-4 mr-1 ${line.isLiked ? 'fill-current' : ''}`} />
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
                      className={`text-white hover:bg-white/10 ${line.isBookmarked ? 'text-yellow-300' : ''}`}
                    >
                      <Bookmark className={`h-4 w-4 ${line.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{line.isBookmarked ? 'Remove bookmark' : 'Bookmark'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          
          {showTimestamp && (
            <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
              <p className="text-sm text-white/70">
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
