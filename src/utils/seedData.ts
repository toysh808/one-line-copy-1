
import { supabase } from '@/integrations/supabase/client';

const REALISTIC_LINES = [
  {
    text: "Just discovered this amazing app called OneLine - it's like Twitter but for meaningful thoughts. Finally, a social platform that makes you think!",
    username: "sarah_connects",
    likes: 342
  },
  {
    text: "The best investment you can make is in yourself. Read books, take courses, build skills. No one can take knowledge away from you.",
    username: "mike_mentor",
    likes: 189
  },
  {
    text: "OneLine is exactly what social media needed - quality over quantity. Every post here feels intentional and thoughtful.",
    username: "emma_writes",
    likes: 267
  },
  {
    text: "Coffee tastes better when you're not checking your phone. Try it - put the device down and just be present with your morning ritual.",
    username: "zen_barista",
    likes: 156
  },
  {
    text: "Started using OneLine last week and I'm already addicted. Finally found a platform where people share actual wisdom instead of just noise.",
    username: "alex_digital",
    likes: 398
  },
  {
    text: "The most productive thing you can do when you feel overwhelmed is to stop and take three deep breaths. Reset your nervous system first.",
    username: "dr_wellness",
    likes: 224
  },
  {
    text: "Been on OneLine for a month now - this app is changing how I think about social media. Every line here sparks genuine conversation.",
    username: "chris_curator",
    likes: 445
  },
  {
    text: "Your future self is counting on the decisions you make today. Choose the harder path that leads to growth over the easy one that leads nowhere.",
    username: "growth_mindset",
    likes: 312
  },
  {
    text: "Love how OneLine forces you to distill your thoughts into one powerful line. It's made me a better writer and thinker.",
    username: "literary_lion",
    likes: 278
  },
  {
    text: "The paradox of choice: having unlimited options often leads to decision paralysis. Sometimes constraints breed the most creativity.",
    username: "philosophy_phil",
    likes: 167
  },
  {
    text: "OneLine is proof that social media can be a force for good. Every post here adds value instead of just stealing attention.",
    username: "techno_optimist",
    likes: 356
  },
  {
    text: "Happiness isn't a destination you arrive at, it's a practice you cultivate daily through small, intentional choices.",
    username: "mindful_maya",
    likes: 289
  },
  {
    text: "This app is revolutionary. OneLine has restored my faith in online communities - real people sharing real insights.",
    username: "community_kate",
    likes: 423
  },
  {
    text: "The best conversations happen when you listen to understand, not to respond. Try it in your next interaction.",
    username: "empathy_expert",
    likes: 198
  },
  {
    text: "OneLine is like a daily dose of wisdom. I've bookmarked more thoughtful content here in a week than on other platforms in a year.",
    username: "wisdom_seeker",
    likes: 367
  },
  {
    text: "Perfectionism is just fear wearing a fancy outfit. Done is better than perfect - ship your work and iterate based on feedback.",
    username: "startup_sage",
    likes: 245
  },
  {
    text: "Finally found my tribe on OneLine! People here actually engage with ideas instead of just scrolling past them.",
    username: "deep_thinker",
    likes: 334
  },
  {
    text: "The most underrated skill in the digital age is the ability to sit alone with your thoughts without reaching for a device.",
    username: "digital_detox",
    likes: 412
  },
  {
    text: "OneLine is everything I wished social media could be - thoughtful, intentional, and genuinely enriching. This app gives me hope.",
    username: "hope_harbinger",
    likes: 489
  },
  {
    text: "Your energy is currency. Spend it on people and projects that give you a return on investment in fulfillment and growth.",
    username: "energy_economist",
    likes: 276
  },
  {
    text: "The quality of your questions determines the quality of your life. Instead of asking 'Why me?' ask 'What can I learn from this?'",
    username: "question_queen",
    likes: 223
  },
  {
    text: "OneLine has become my daily source of inspiration. It's amazing how one thoughtful line can shift your entire perspective.",
    username: "perspective_shift",
    likes: 356
  },
  {
    text: "Creativity isn't about having good ideas, it's about having bad ideas and not being afraid to share them until you find the gold.",
    username: "creative_courage",
    likes: 189
  },
  {
    text: "This platform is pure genius. OneLine proves that when you limit characters, you amplify meaning. Every word counts here.",
    username: "word_wizard",
    likes: 401
  },
  {
    text: "The most powerful word in any language is 'yet'. I can't do this... yet. It transforms impossibility into possibility.",
    username: "yet_believer",
    likes: 298
  },
  {
    text: "OneLine is addictive in the best way possible. Instead of mindless scrolling, I find myself genuinely pondering each post.",
    username: "mindful_scroller",
    likes: 378
  },
  {
    text: "Success isn't about avoiding failure, it's about failing faster and learning quicker than everyone else.",
    username: "fail_forward",
    likes: 234
  },
  {
    text: "Never thought I'd say this about a social app, but OneLine actually makes me smarter. The content here is just different.",
    username: "smart_social",
    likes: 445
  },
  {
    text: "The best leaders are those who create more leaders, not more followers. Empower others to find their own voice.",
    username: "leadership_lab",
    likes: 267
  },
  {
    text: "OneLine is the antidote to social media toxicity. Finally, a place where depth beats drama and wisdom wins over noise.",
    username: "wisdom_warrior",
    likes: 512
  }
];

export const seedMockData = async () => {
  try {
    // Create profiles for mock users
    const profiles = REALISTIC_LINES.map((line, index) => ({
      id: `user_${index + 1}`,
      username: line.username,
      is_premium: Math.random() > 0.8
    }));

    // Insert profiles
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert(profiles);

    if (profilesError && !profilesError.message.includes('duplicate key')) {
      console.error('Error inserting profiles:', profilesError);
      return;
    }

    // Create lines with realistic timestamps (spread over the last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const lines = REALISTIC_LINES.map((line, index) => {
      const randomTime = new Date(
        sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime())
      );

      return {
        id: `line_${index + 1}`,
        text: line.text,
        author_id: `user_${index + 1}`,
        likes_count: line.likes,
        created_at: randomTime.toISOString(),
        theme: 'Default'
      };
    });

    // Insert lines
    const { error: linesError } = await supabase
      .from('lines')
      .insert(lines);

    if (linesError && !linesError.message.includes('duplicate key')) {
      console.error('Error inserting lines:', linesError);
      return;
    }

    // Create realistic likes data
    const likes = [];
    for (let i = 0; i < REALISTIC_LINES.length; i++) {
      const lineId = `line_${i + 1}`;
      const likesCount = REALISTIC_LINES[i].likes;
      
      // Create likes from different users
      for (let j = 0; j < Math.min(likesCount, 50); j++) {
        const randomUserIndex = Math.floor(Math.random() * profiles.length);
        likes.push({
          line_id: lineId,
          user_id: `user_${randomUserIndex + 1}`
        });
      }
    }

    // Insert likes (in batches to avoid overwhelming the database)
    const batchSize = 100;
    for (let i = 0; i < likes.length; i += batchSize) {
      const batch = likes.slice(i, i + batchSize);
      const { error: likesError } = await supabase
        .from('likes')
        .insert(batch);

      if (likesError && !likesError.message.includes('duplicate key')) {
        console.error('Error inserting likes batch:', likesError);
      }
    }

    // Create some bookmarks
    const bookmarks = [];
    for (let i = 0; i < 20; i++) {
      const randomLineIndex = Math.floor(Math.random() * REALISTIC_LINES.length);
      const randomUserIndex = Math.floor(Math.random() * profiles.length);
      bookmarks.push({
        line_id: `line_${randomLineIndex + 1}`,
        user_id: `user_${randomUserIndex + 1}`
      });
    }

    const { error: bookmarksError } = await supabase
      .from('bookmarks')
      .insert(bookmarks);

    if (bookmarksError && !bookmarksError.message.includes('duplicate key')) {
      console.error('Error inserting bookmarks:', bookmarksError);
    }

    console.log('Mock data seeded successfully!');
  } catch (error) {
    console.error('Error seeding mock data:', error);
  }
};

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
