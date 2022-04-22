import React, {
  memo,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Transition } from "react-transition-group";
import { ENTERED, ENTERING, EXITING } from "react-transition-group/Transition";

import { duration, opacityModal, scaleModal, opacityOverlay } from "./consts";
import { Portal } from "./Portal";

import "./style.css";

export const Modal = memo(
  ({ children, isOpen: isOpenProps = false, onClose, name }: any) => {
    const [isOpen, setIsOpen] = useState(isOpenProps);
    const portalRef = useRef<HTMLDivElement>();
    const offsetClickCoordsRef = useRef<{ x: number; y: number }>();
    const isMovedRef = useRef(false);

    const wasModevBeforeRef = useRef(false);

    const modalContentRef = useRef<HTMLDivElement>(null);

    const needForRafRef = useRef(true);

    const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
      setIsOpen(isOpenProps);
    }, [isOpenProps]);

    const handleClose: React.MouseEventHandler<
      HTMLDivElement | HTMLButtonElement
    > = useCallback(() => {
      if (isMovedRef.current) return;
      onClose(name);
    }, [onClose, name]);

    const handleContentClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
    };

    const onMouseMoveRaf = useCallback(({ clientX, clientY }: MouseEvent) => {
      wasModevBeforeRef.current = true;
      const offsetX = clientX - offsetClickCoordsRef.current?.x!;
      const offsetY = clientY - offsetClickCoordsRef.current?.y!;

      console.log(
        "!!MOVE",
        offsetClickCoordsRef.current?.x,
        offsetClickCoordsRef.current?.y,
        offsetX,
        offsetY
      );

      setModalOffset({
        x: offsetX,
        y: offsetY,
      });
      needForRafRef.current = true;
    }, []);

    const onMouseMove = useCallback((e) => {
      if (needForRafRef.current) {
        needForRafRef.current = false;
        requestAnimationFrame(() => onMouseMoveRaf(e));
      }
    }, []);

    const onMouseUp = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp, true);
    }, []);

    const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
      ({ clientX, clientY }) => {
        const { x, y } = modalContentRef.current!.getBoundingClientRect();

        offsetClickCoordsRef.current = {
          x: clientX - x,
          y: clientY - y,
        };
        console.log("!!DOWN", x, y, clientX - x, clientY - y);

        isMovedRef.current = true;
        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp, true);
      },
      []
    );

    return (
      <Portal ref={portalRef}>
        <Transition timeout={{ enter: 0, exit: duration }} in={isOpen}>
          {(state) =>
            [ENTERING, ENTERED, EXITING].includes(state) && (
              <div
                className="modal-overlay"
                style={{
                  transition: `${duration}ms`,
                  opacity: opacityOverlay[state],
                }}
                onClick={handleClose}
              >
                <div
                  className="modal-content"
                  ref={modalContentRef}
                  style={{
                    transition: `${duration}ms`,
                    transitionProperty: "transform",

                    ...(wasModevBeforeRef.current && {
                      position: "fixed",
                      top: `${modalOffset.y}px`,
                      left: `${modalOffset.x}px`,
                    }),

                    transform: `scale(${scaleModal[state]})`,
                    opacity: opacityModal[state],
                  }}
                  onClick={handleContentClick}
                >
                  <div
                    className="modal-close-button-wrapper"
                    onMouseDown={onMouseDown}
                  >
                    {" "}
                    <button onClick={handleClose}>Close</button>{" "}
                  </div>
                  {children}
                </div>
              </div>
            )
          }
        </Transition>
      </Portal>
    );
  }
);
