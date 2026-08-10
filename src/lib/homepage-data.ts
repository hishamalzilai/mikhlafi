"use server";

import { supabase } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export interface HomepageData {
  latestStudies: any[];
  latestVideo: any;
  latestPhoto: any;
  latestNews: any[];
  latestTestimonials: any[];
}

export const getCachedHomepageData = unstable_cache(
  async (): Promise<HomepageData> => {
    try {
      const [
        { data: latestStudies },
        { data: latestVideo },
        { data: latestPhoto },
        { data: latestNews },
        { data: latestTestimonials },
      ] = await Promise.all([
        supabase
          .from('studies')
          .select('*')
          .order('published_date', { ascending: false })
          .limit(2),
        supabase
          .from('media_library')
          .select('*')
          .eq('type', 'video')
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('media_library')
          .select('*')
          .eq('type', 'photo')
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('news')
          .select('*')
          .order('published_date', { ascending: false })
          .limit(3),
        supabase
          .from('testimonials')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      return {
        latestStudies: latestStudies || [],
        latestVideo,
        latestPhoto,
        latestNews: latestNews || [],
        latestTestimonials: latestTestimonials || [],
      };
    } catch (err) {
      console.error('[getCachedHomepageData] error:', err);
      return {
        latestStudies: [],
        latestVideo: null,
        latestPhoto: null,
        latestNews: [],
        latestTestimonials: [],
      };
    }
  },
  ['homepage-data'],
  { revalidate: 60, tags: [CACHE_TAGS.homepage] }
);
