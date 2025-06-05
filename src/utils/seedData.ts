
import { supabase } from '@/integrations/supabase/client';

export const getLineOfTheDayFromDB = async () => {
  try {
    // Get the line with the most likes from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data, error } = await supabase
      .from('lines')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .order('likes_count', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // Fallback to highest liked line overall if no lines in last 24h
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('lines')
        .select('*')
        .order('likes_count', { ascending: false })
        .limit(1)
        .single();

      if (fallbackError || !fallbackData) {
        return null;
      }

      // Get the profile for the fallback line
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', fallbackData.author_id)
        .single();

      return {
        id: fallbackData.id,
        text: fallbackData.text,
        author: profileData?.username || 'Unknown',
        authorId: fallbackData.author_id,
        likes: fallbackData.likes_count || 0,
        timestamp: new Date(fallbackData.created_at),
        isLiked: false,
        isBookmarked: false
      };
    }

    // Get the profile for the main line
    const { data: profileData } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.author_id)
      .single();

    return {
      id: data.id,
      text: data.text,
      author: profileData?.username || 'Unknown',
      authorId: data.author_id,
      likes: data.likes_count || 0,
      timestamp: new Date(data.created_at),
      isLiked: false,
      isBookmarked: false
    };
  } catch (error) {
    console.error('Error fetching line of the day:', error);
    return null;
  }
};
