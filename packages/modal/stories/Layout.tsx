import { FC } from "react";

import { ModalContextProvider } from "../src/ModalContext";

export const Layout: FC = ({ children }) => {
  return <ModalContextProvider>{children}</ModalContextProvider>;
};
