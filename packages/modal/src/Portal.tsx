import { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import { createPortal } from "react-dom";

import { usePortal } from "./usePortal";

const mutationObserverConfig = {
  childList: true,
};

export const Portal = forwardRef(({ children }: any, ref: any) => {
  const elem = usePortal();

  ref.current = elem;

  useEffect(() => {
    const observer = new MutationObserver(([changedChildren]) => {
      const hasChildNodes = changedChildren.target.hasChildNodes();
      document.body.style.overflow = hasChildNodes ? "hidden" : "inherit";
    });

    observer.observe(elem, mutationObserverConfig);

    return () => {
      observer.disconnect();
    };
  }, []);

  return createPortal(children, elem as HTMLDivElement);
});
