
import React from 'react';
import { PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 bg-primary hover:bg-primary/90"
      size="icon"
    >
      <PenTool className="h-6 w-6" />
    </Button>
  );
};
