import { createContext, useContext } from "react";

export const ScrollBarContext = createContext({ width: 0, visible: false });

export const useScrollBarContext = () => {
  const { width, visible } = useContext(ScrollBarContext);
  return { width, visible };
};

export const { Provider: ScrollBarProvider, Consumer: ScrollBarConsumer } =
  ScrollBarContext;
