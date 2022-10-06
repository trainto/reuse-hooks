import { useCallback, useEffect, useRef } from 'react';

const useSwipe = (callback: (direction: 'left' | 'right' | 'up' | 'down') => void, threshold = 100) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const ref = useRef<HTMLDivElement>(null);

  const xDownRef = useRef<null | number>(null);
  const yDownRef = useRef<null | number>(null);
  const xDiffRef = useRef<number>(0);
  const yDiffRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const firstTouch = e.touches[0];
    xDownRef.current = firstTouch.clientX;
    yDownRef.current = firstTouch.clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!xDownRef.current || !yDownRef.current) {
      return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    xDiffRef.current = xDownRef.current - xUp;
    yDiffRef.current = yDownRef.current - yUp;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(xDiffRef.current) > Math.abs(yDiffRef.current)) {
      if (xDiffRef.current > threshold) {
        savedCallback.current('right');
      } else if (xDiffRef.current < -threshold) {
        savedCallback.current('left');
      }
    } else {
      if (yDiffRef.current > threshold) {
        savedCallback.current('down');
      } else if (yDiffRef.current < -threshold) {
        savedCallback.current('up');
      }
    }
  }, [threshold]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const copy = ref.current;

    copy.addEventListener('touchstart', handleTouchStart);
    copy.addEventListener('touchmove', handleTouchMove);
    copy.addEventListener('touchend', handleTouchEnd);

    return () => {
      copy.removeEventListener('touchstart', handleTouchStart);
      copy.removeEventListener('touchmove', handleTouchMove);
      copy.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchEnd, handleTouchMove, handleTouchStart]);

  return ref;
};

export default useSwipe;
