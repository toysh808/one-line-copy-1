
import { Line } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const getLineOfTheDayFromDB = async (): Promise<Line | null> => {
  try {
    // Get the most liked line from yesterday (or any recent day if no lines from yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    let query = supabase
      .from('lines')
      .select(`
        *,
        likes(user_id),
        bookmarks(user_id)
      `)
      .order('likes_count', { ascending: false })
      .limit(1);

    // First try to get lines from yesterday
    const { data: yesterdayLines, error: yesterdayError } = await query
      .gte('created_at', yesterday.toISOString())
      .lte('created_at', endOfYesterday.toISOString());

    if (yesterdayError) {
      console.error('Error fetching yesterday lines:', yesterdayError);
    }

    let selectedLine = yesterdayLines?.[0];

    // If no lines from yesterday, get the most liked line from the last week
    if (!selectedLine) {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const { data: weekLines, error: weekError } = await supabase
        .from('lines')
        .select(`
          *,
          likes(user_id),
          bookmarks(user_id)
        `)
        .gte('created_at', lastWeek.toISOString())
        .order('likes_count', { ascending: false })
        .limit(1);

      if (weekError) {
        console.error('Error fetching week lines:', weekError);
      }

      selectedLine = weekLines?.[0];
    }

    if (!selectedLine) {
      return null;
    }

    // Get the author's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', selectedLine.author_id)
      .single();

    if (profileError) {
      console.error('Error fetching author profile:', profileError);
    }

    // Transform to Line interface
    const transformedLine: Line = {
      id: selectedLine.id,
      text: selectedLine.text,
      author: profileData?.username || 'Unknown',
      authorId: selectedLine.author_id,
      likes: selectedLine.likes_count || 0,
      timestamp: new Date(selectedLine.created_at),
      isLiked: false, // Will be updated based on current user
      isBookmarked: false // Will be updated based on current user
    };

    return transformedLine;
  } catch (error) {
    console.error('Error fetching line of the day from DB:', error);
    return null;
  }
};
