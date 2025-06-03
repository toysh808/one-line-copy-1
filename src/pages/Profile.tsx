
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineCard } from '@/components/LineCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Line } from '@/types';
import { generateMockLines } from '@/utils/mockData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [myLines, setMyLines] = useState<Line[]>([]);
  const [bookmarkedLines, setBookmarkedLines] = useState<Line[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user profile
    fetchUserProfile();
    
    // Load user's lines and bookmarks
    const allLines = generateMockLines();
    const userLines = allLines.filter(line => line.authorId === user.id).slice(0, 5);
    const bookmarks = allLines.filter(line => line.isBookmarked).slice(0, 3);
    
    setMyLines(userLines);
    setBookmarkedLines(bookmarks);
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setCurrentUsername(data.username || '');
        setEditUsername(data.username || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (!user) {
    return null;
  }

  const handleSaveUsername = async () => {
    if (editUsername.trim()) {
      const { error } = await updateUser({ username: editUsername.trim() });
      
      if (error) {
        toast({
          title: "Update failed",
          description: error.message || "Failed to update username",
          variant: "destructive"
        });
      } else {
        setCurrentUsername(editUsername.trim());
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your username has been changed successfully."
        });
      }
    }
  };

  const handleLineUpdate = (updatedLine: Line, isMine: boolean) => {
    if (isMine) {
      setMyLines(prev => prev.map(line => 
        line.id === updatedLine.id ? updatedLine : line
      ));
    } else {
      setBookmarkedLines(prev => prev.map(line => 
        line.id === updatedLine.id ? updatedLine : line
      ));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                    <Button onClick={handleSaveUsername} size="sm">
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditUsername(currentUsername);
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Input value={currentUsername ? `@${currentUsername}` : 'Loading...'} readOnly />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user.email || ''} readOnly className="bg-muted" />
              {user.email_confirmed_at ? (
                <p className="text-sm text-green-600">✓ Email verified</p>
              ) : (
                <p className="text-sm text-orange-600">⚠ Email not verified</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="lines" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lines">My Lines ({myLines.length})</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarked ({bookmarkedLines.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="lines" className="space-y-4">
            {myLines.length > 0 ? (
              myLines.map((line) => (
                <LineCard 
                  key={line.id} 
                  line={line} 
                  onUpdate={(updatedLine) => handleLineUpdate(updatedLine, true)}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't posted any lines yet</p>
                <Button onClick={() => navigate('/')}>
                  Share your first line
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            {bookmarkedLines.length > 0 ? (
              bookmarkedLines.map((line) => (
                <LineCard 
                  key={line.id} 
                  line={line} 
                  onUpdate={(updatedLine) => handleLineUpdate(updatedLine, false)}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No bookmarked lines yet</p>
                <Button onClick={() => navigate('/')}>
                  Discover great lines
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
