import { forwardRef } from "react";
import { createPortal } from "react-dom";

import { usePortal } from "./usePortal";

export const Portal = forwardRef(({ children }: any, ref: any) => {
  const elem = usePortal();

  ref.current = elem;

  return createPortal(children, elem as HTMLDivElement);
});
