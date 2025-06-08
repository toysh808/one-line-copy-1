
import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoading: boolean;
  dateFilter?: string;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({ 
  hasMore, 
  isLoadingMore, 
  isLoading, 
  dateFilter, 
  onLoadMore 
}: UseInfiniteScrollProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || dateFilter) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, dateFilter, onLoadMore]);

  return { loadMoreRef };
};
