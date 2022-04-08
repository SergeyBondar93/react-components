import { FC, useEffect, useRef, useState } from "react";

import { ScrollBarProvider } from "./ScrollBarContext";

export const ScrollbarWidthSpy: FC = ({ children }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const { width: newWidth } = divRef.current!.getBoundingClientRect();

      const newScrollbarWidth = window.innerWidth - newWidth;

      if (newScrollbarWidth) {
        setScrollbarWidth(newScrollbarWidth);
      }

      setIsScrollbarVisible(!!newScrollbarWidth);
    });
    observer.observe(divRef.current!);

    return () => {
      observer.unobserve(divRef.current!);
      observer.disconnect();
    };
  }, [scrollbarWidth]);

  return (
    <ScrollBarProvider
      value={{ width: scrollbarWidth, visible: isScrollbarVisible }}
    >
      <div ref={divRef}> {children} </div>;
    </ScrollBarProvider>
  );
};
