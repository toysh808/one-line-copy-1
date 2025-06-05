
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { LineOfTheDay } from '@/components/LineOfTheDay';
import { LineFeed } from '@/components/LineFeed';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ComposeModal } from '@/components/ComposeModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const dateFilter = searchParams.get('date');

  const handleCompose = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsComposeOpen(true);
  };

  const handleLinePosted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLinePosted={handleLinePosted} />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {!dateFilter && <LineOfTheDay />}
          <LineFeed 
            dateFilter={dateFilter || undefined} 
            refreshTrigger={refreshTrigger}
          />
        </div>
      </main>

      <FloatingActionButton onClick={handleCompose} />
      <ComposeModal 
        isOpen={isComposeOpen} 
        onOpenChange={setIsComposeOpen}
        onLinePosted={handleLinePosted}
      />
    </div>
  );
};

export default Index;
