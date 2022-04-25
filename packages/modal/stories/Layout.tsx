import { FC, useEffect, useState } from "react";
import { useScrollbarWidth } from "react-use";

import { ModalContextProvider } from "../src/ModalContext";

export const Layout: FC = ({ children }) => {
  const sbw = useScrollbarWidth();
  const [isShowScrollbar, setIsShowScrollbar] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(([mutation]) => {
      const isBodyOverflowHidden =
        (mutation.target as HTMLBodyElement).style.overflow === "hidden";

      setIsShowScrollbar(!isBodyOverflowHidden);
    });
    observer.observe(document.body, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        paddingRight: isShowScrollbar ? "0px" : sbw + "px",
      }}
    >
      <ModalContextProvider>{children}</ModalContextProvider>;
    </div>
  );
};
