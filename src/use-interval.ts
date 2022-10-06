import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
