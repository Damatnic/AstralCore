import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
  }: IntersectionObserverOptions
): boolean => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, root, rootMargin]);

  return isInView;
};
