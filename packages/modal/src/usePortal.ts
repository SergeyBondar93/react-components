import { useRef } from "react";

export const usePortal = () => {
  const elem = useRef<HTMLDivElement>();
  const prevPortal = document.getElementById("portal") as HTMLDivElement;

  if (prevPortal) {
    elem.current = prevPortal;
  } else {
    const newPortal = document.createElement("div");
    newPortal.id = "portal";
    document.body.appendChild(newPortal);
    elem.current = newPortal;
  }
  return elem.current;
};
