import { FC } from "react";

import ScrollbarWidthSpy, {
  useScrollBarContext,
} from "@serj/scrollbar-width-spy";

const App = ({ children }: any) => {
  const { visible, width } = useScrollBarContext();

  return (
    <div
      className="App"
      style={{ paddingRight: visible ? "0px" : `${width}px` }}
    >
      {children}
    </div>
  );
};

export const Layout: FC = ({ children }) => {
  return (
    <>
      <ScrollbarWidthSpy>
        <App>{children}</App>
      </ScrollbarWidthSpy>
    </>
  );
};
