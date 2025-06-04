
import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComposeModal } from './ComposeModal';
import { SearchModal } from './SearchModal';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLinePosted?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLinePosted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleProfile = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/profile');
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            OneLine
          </button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSearch} className="h-10 w-10">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleProfile} className="h-10 w-10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ComposeModal 
        isOpen={isComposeOpen} 
        onOpenChange={setIsComposeOpen}
        onLinePosted={onLinePosted}
      />
      <SearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
