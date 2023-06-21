import React, { MutableRefObject } from 'react';

interface UseIntersectionObserver {
  root: MutableRefObject<Element | null> | null;
  target: MutableRefObject<Element | null>;
  onIntersect: Function;
  threshold?: number;
  rootMargin?: string;
  enabled?: any;
}

export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}: UseIntersectionObserver) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      },
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target, enabled, root, threshold, rootMargin, onIntersect]);
}
