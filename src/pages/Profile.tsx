
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load data immediately without showing loading state
    loadProfileData();
  }, [user, navigate]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Load all data in parallel for better performance
      const [profileData, userLinesData, bookmarksData] = await Promise.all([
        fetchUserProfile(),
        loadUserLines(),
        loadBookmarkedLines()
      ]);
      
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setIsInitialLoad(false);
    }
  };

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

  const loadUserLines = async () => {
    if (!user) return;

    try {
      const { data: linesData, error } = await supabase
        .from('lines')
        .select(`
          *,
          likes(user_id),
          bookmarks(user_id)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading user lines:', error);
        return;
      }

      if (linesData) {
        // Get profile data for the author (which is the current user)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        const transformedLines: Line[] = linesData.map(line => ({
          id: line.id,
          text: line.text,
          author: profileData?.username || 'Unknown',
          authorId: line.author_id,
          likes: line.likes_count || 0,
          timestamp: new Date(line.created_at),
          isLiked: line.likes.some((like: any) => like.user_id === user.id),
          isBookmarked: line.bookmarks.some((bookmark: any) => bookmark.user_id === user.id)
        }));

        setMyLines(transformedLines);
      }
    } catch (error) {
      console.error('Error loading user lines:', error);
    }
  };

  const loadBookmarkedLines = async () => {
    if (!user) return;

    try {
      const { data: bookmarksData, error } = await supabase
        .from('bookmarks')
        .select(`
          line_id,
          lines(
            *,
            likes(user_id),
            bookmarks(user_id)
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading bookmarked lines:', error);
        return;
      }

      if (bookmarksData) {
        // Get all author IDs from the bookmarked lines
        const authorIds = [...new Set(bookmarksData.map((bookmark: any) => bookmark.lines.author_id))];
        
        // Fetch profile data for all authors
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', authorIds);

        const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile.username]) || []);

        const transformedLines: Line[] = bookmarksData.map((bookmark: any) => {
          const line = bookmark.lines;
          return {
            id: line.id,
            text: line.text,
            author: profilesMap.get(line.author_id) || 'Unknown',
            authorId: line.author_id,
            likes: line.likes_count || 0,
            timestamp: new Date(line.created_at),
            isLiked: line.likes.some((like: any) => like.user_id === user.id),
            isBookmarked: true // All these lines are bookmarked
          };
        });

        setBookmarkedLines(transformedLines);
      }
    } catch (error) {
      console.error('Error loading bookmarked lines:', error);
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

  const handleLineUpdate = async (updatedLine: Line) => {
    if (!user) return;

    try {
      // Handle like/unlike
      const originalLine = [...myLines, ...bookmarkedLines].find(l => l.id === updatedLine.id);
      if (originalLine && updatedLine.isLiked !== originalLine.isLiked) {
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

      // Handle bookmark/unbookmark
      if (originalLine && updatedLine.isBookmarked !== originalLine.isBookmarked) {
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

      // Update local state
      setMyLines(prev => prev.map(line => 
        line.id === updatedLine.id ? updatedLine : line
      ));
      
      setBookmarkedLines(prev => {
        if (!updatedLine.isBookmarked) {
          // Remove from bookmarked lines if unbookmarked
          return prev.filter(line => line.id !== updatedLine.id);
        }
        return prev.map(line => 
          line.id === updatedLine.id ? updatedLine : line
        );
      });
    } catch (error) {
      console.error('Error updating line interaction:', error);
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
                  onUpdate={handleLineUpdate}
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
                  onUpdate={handleLineUpdate}
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
