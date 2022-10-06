import { useEffect, useRef } from 'react';

const useWindowResize = (callback: () => void) => {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleResize = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
};

export default useWindowResize;
