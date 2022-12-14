import { useEffect, useRef } from 'react';

const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
  whenMouseDown = true
) => {
  const container = useRef<T>(null);
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleOutsideClicked = (e: MouseEvent) => {
      if (!savedCallback.current) {
        return;
      }

      if (container.current && e.target != null) {
        if (!container.current.contains(e.target as Node)) {
          savedCallback.current();
        }
      }
    };

    document.addEventListener(whenMouseDown ? "mousedown" : "click", handleOutsideClicked);

    return () =>
      document.removeEventListener(whenMouseDown ? "mousedown" : "click", handleOutsideClicked);
  }, [whenMouseDown]);

  return container;
};

export default useClickOutside;
