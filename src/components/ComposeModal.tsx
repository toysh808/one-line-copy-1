
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

interface ComposeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onOpenChange }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const charactersLeft = 100 - text.length;
  const isValid = text.trim().length > 0 && text.length <= 100;

  useEffect(() => {
    if (isOpen) {
      setText('');
    }
  }, [isOpen]);

  const handlePost = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post lines.",
        variant: "destructive"
      });
      return;
    }

    if (!isValid) return;

    setIsPosting(true);
    
    // Simulate posting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Line posted!",
      description: "Your thought has been shared with the world."
    });
    
    setIsPosting(false);
    onOpenChange(false);
    setText('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={isMobile ? "h-full max-h-full m-0 rounded-none" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Share your line</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none text-base"
              maxLength={100}
              autoFocus
            />
            
            <div className="flex justify-between items-center">
              <span className={`text-sm ${charactersLeft < 20 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {charactersLeft} characters left
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePost}
              disabled={!isValid || !user || isPosting}
              className="flex-1"
            >
              {isPosting ? 'Posting...' : 'Post Line'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
