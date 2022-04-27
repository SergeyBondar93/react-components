import React, {
  CSSProperties,
  FC,
  memo,
  MouseEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Transition } from "react-transition-group";
import { ENTERED, ENTERING, EXITING } from "react-transition-group/Transition";

import {
  duration,
  opacityModal,
  scaleModal,
  opacityOverlay,
  rollWidth,
} from "./consts";
import { ModalContext } from "./ModalContext";
import { Portal } from "./Portal";

import "./style.css";

export interface IModalProps {
  isOpen?: boolean;
  onClose?: any;
  name: string;
  title?: string;
}

interface SizesState {
  width: number;
  height: "auto" | number;
}

export const Modal: FC<IModalProps> = memo(
  ({ children, isOpen: isOpenProps = false, onClose, name, title }) => {
    const { modalProviderValue, setModalProviderValue } =
      useContext(ModalContext);

    const [sizes, setSizes] = useState<SizesState>({
      width: 500,
      height: "auto",
    });

    const [isOpen, setIsOpen] = useState(isOpenProps);
    const [needOverlay, setNeedOverlay] = useState(true);
    const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
    const [isRolled, setIsRolled] = useState(false);

    const [widthDiff, setWidthDiff] = useState(0);
    const [heightDiff, setHeightDiff] = useState(0);

    const portalRef = useRef<HTMLDivElement>();
    const offsetClickCoordsRef = useRef<{ x: number; y: number }>();
    const isMovedRef = useRef(false);
    const wasModevBeforeRef = useRef(false);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const isRollingRef = useRef(true);
    const resizeClickCoordsRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
      setIsOpen(isOpenProps);
    }, [isOpenProps]);

    useEffect(() => {
      setModalProviderValue((s) => {
        const newModalsWithOverlay =
          isOpen && !isRolled && needOverlay
            ? [...s.modalsWithOverlays!, name]
            : s.modalsWithOverlays?.filter((n) => n !== name);

        const newOpenedModals = isOpen
          ? [...new Set([...s.openedModals!, name])]
          : s.openedModals?.filter((modalName) => modalName !== name);

        return {
          ...s,
          openedModals: newOpenedModals,
          modalsWithOverlays: newModalsWithOverlay,
        };
      });
    }, [needOverlay, name, isOpen, isRolled]);

    useEffect(() => {
      if (isOpen && (!modalOffset.x || !modalOffset.y)) {
        isRollingRef.current = false;
        setTimeout(() => {
          const { width, height } =
            modalContentRef.current?.getBoundingClientRect()!;
          const offsetLeft =
            (window.innerWidth - width / scaleModal.entering) / 2;
          const offsetTop =
            (window.innerHeight - height / scaleModal.entering) / 2;
          setModalOffset({
            x: offsetLeft,
            y: offsetTop,
          });
        }, 0);
      }
    }, [isOpen, name]);

    useEffect(() => {
      if (isOpen && sizes.height === "auto")
        [
          setTimeout(() => {
            const { height } =
              modalContentRef.current?.getBoundingClientRect()!;
            const computedHeight = height / scaleModal.entering;

            setSizes({ ...sizes, height: computedHeight });
          }, 0),
        ];
    }, [isOpen, sizes]);

    const handleClose: React.MouseEventHandler<
      HTMLDivElement | HTMLButtonElement
    > = useCallback(() => {
      if (isMovedRef.current) return;
      onClose(name);
    }, [onClose, name]);

    const handleContentClick: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        e.stopPropagation();
      }, []);

    const handleMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
      wasModevBeforeRef.current = true;
      const offsetX = clientX - offsetClickCoordsRef.current?.x!;
      const offsetY = clientY - offsetClickCoordsRef.current?.y!;

      setModalOffset({
        x: offsetX,
        y: offsetY,
      });
    }, []);

    const handleMouseUp = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp, true);
    }, []);

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
      ({ clientX, clientY }) => {
        const { x, y } = modalContentRef.current!.getBoundingClientRect();

        offsetClickCoordsRef.current = {
          x: clientX - x,
          y: clientY - y,
        };
        isMovedRef.current = true;
        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp, true);
      },
      []
    );

    const handleToggleNeedOverlay = useCallback(() => {
      setNeedOverlay(!needOverlay);
    }, [needOverlay]);

    const handleRoll = useCallback(() => {
      setIsRolled(true);
      isRollingRef.current = true;
    }, [name]);

    const handleUnRoll = useCallback(() => {
      setIsRolled(false);
      setTimeout(() => {
        isRollingRef.current = false;
      }, 0);
    }, []);

    const rolledOffsetLeft = useMemo(() => {
      const idx = modalProviderValue.openedModals.findIndex(
        (modalName) => modalName === name
      );

      return (idx === -1 ? 0 : idx) * rollWidth;
    }, [modalProviderValue.openedModals, name]);

    const isMoveTopSide = useRef(false);

    const handleResizeTopMouseDown = useCallback((e) => {
      isMoveTopSide.current = true;
      resizeClickCoordsRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      isMovedRef.current = true;
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleResizeTop);
      window.addEventListener("mouseup", handleResizeTopEnd, true);
    }, []);

    const handleResizeTopEnd = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      let diff = 0;
      setHeightDiff((oldDiff) => {
        diff = oldDiff;
        return 0;
      });
      setSizes((s) => ({
        width: s.width,
        height: (s.height as number) + diff,
      }));

      setModalOffset((offset) => {
        return {
          ...offset,
          y: offset.y - diff,
        };
      });
      isMoveTopSide.current = false;
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleResizeTop);
      window.removeEventListener("mouseup", handleResizeTopEnd, true);
    }, []);

    const handleResizeTop = useCallback((e: MouseEvent) => {
      const { clientY } = e;
      setHeightDiff(resizeClickCoordsRef.current.y - clientY);
    }, []);
    const handleResizeBottomMouseDown = useCallback((e) => {
      resizeClickCoordsRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      isMovedRef.current = true;
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleResizeBottom);
      window.addEventListener("mouseup", handleResizeBottomEnd, true);
    }, []);

    const handleResizeBottomEnd = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      let diff = 0;
      setHeightDiff((oldDiff) => {
        diff = oldDiff;
        return 0;
      });
      setSizes((s) => ({
        width: s.width,
        height: (s.height as number) + diff,
      }));

      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleResizeBottom);
      window.removeEventListener("mouseup", handleResizeBottomEnd, true);
    }, []);

    const handleResizeBottom = useCallback((e: MouseEvent) => {
      const { clientY } = e;
      setHeightDiff(clientY - resizeClickCoordsRef.current.y);
    }, []);

    const handleResizeRight = useCallback((e: MouseEvent) => {
      const { clientX } = e;
      setWidthDiff(clientX - resizeClickCoordsRef.current.x);
    }, []);

    const handleResizeRightEnd = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      let diff = 0;
      setWidthDiff((oldDiff) => {
        diff = oldDiff;
        return 0;
      });
      setSizes((s) => ({ width: s.width + diff, height: s.height }));

      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleResizeRight);
      window.removeEventListener("mouseup", handleResizeRightEnd, true);
    }, []);

    const handleResizeRightMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        resizeClickCoordsRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
        isMovedRef.current = true;
        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", handleResizeRight);
        window.addEventListener("mouseup", handleResizeRightEnd, true);
      }, []);

    const isMoveLeftSide = useRef(false);

    const handleResizeLeft = useCallback((e: MouseEvent) => {
      const { clientX } = e;
      const newDiff = resizeClickCoordsRef.current.x - clientX;

      let width = 0;
      setSizes((s) => {
        width = s.width;
        return s;
      });

      if (Math.abs(newDiff) > width - 50) return;

      setWidthDiff(newDiff);
    }, []);

    const handleResizeLeftEnd = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      let diff = 0;
      setWidthDiff((oldDiff) => {
        diff = oldDiff;
        return 0;
      });
      setSizes((s) => ({ width: s.width + diff, height: s.height }));

      setModalOffset((offset) => {
        return {
          ...offset,
          x: offset.x - diff,
        };
      });

      isMoveLeftSide.current = false;
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleResizeLeft);
      window.removeEventListener("mouseup", handleResizeLeftEnd, true);
    }, []);

    const handleResizeLeftMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        resizeClickCoordsRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
        isMovedRef.current = true;
        isMoveLeftSide.current = true;

        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", handleResizeLeft);
        window.addEventListener("mouseup", handleResizeLeftEnd, true);
      }, []);

    return (
      <Portal ref={portalRef}>
        <Transition timeout={{ enter: 0, exit: duration }} in={isOpen}>
          {(state) =>
            [ENTERING, ENTERED, EXITING].includes(state) && (
              <>
                {needOverlay && !isRolled && (
                  <div
                    className="modal-overlay"
                    style={{
                      transition: `${duration}ms`,
                      opacity: opacityOverlay[state],
                    }}
                    onClick={handleClose}
                  ></div>
                )}
                <div
                  className="modal-content"
                  ref={modalContentRef}
                  style={{
                    transition: `${duration}ms`,
                    transitionProperty: !isRollingRef.current
                      ? "transform"
                      : "transform, top, left",
                    transform: `scale(${scaleModal[state]})`,
                    opacity: opacityModal[state],

                    ...(isRolled
                      ? {
                          top: "105%",
                          width: `${rollWidth}px`,
                          height: "30px",
                          left: `${rolledOffsetLeft}px`,
                        }
                      : {
                          height:
                            sizes.height === "auto"
                              ? sizes.height
                              : `${sizes.height + heightDiff}px`,

                          width: `${sizes.width + widthDiff}px`,
                          top: `${
                            modalOffset.y -
                            (isMoveTopSide.current ? heightDiff : 0)
                          }px`,
                          left: `${
                            modalOffset.x -
                            (isMoveLeftSide.current ? widthDiff : 0)
                          }px`,
                        }),
                  }}
                  onClick={handleContentClick}
                >
                  <div
                    onMouseDown={handleResizeTopMouseDown}
                    className="modal-resizer  modal-resizer-top"
                  ></div>
                  <div
                    onMouseDown={handleResizeRightMouseDown}
                    className="modal-resizer  modal-resizer-right"
                  ></div>
                  <div
                    onMouseDown={handleResizeBottomMouseDown}
                    className="modal-resizer  modal-resizer-bottom"
                  ></div>
                  <div
                    onMouseDown={handleResizeLeftMouseDown}
                    className="modal-resizer  modal-resizer-left"
                  ></div>

                  <div className="modal-content-close-button-wrapper">
                    <button onClick={handleToggleNeedOverlay}>Over</button>
                    <div
                      className="modal-content-header-movable-zone"
                      onMouseDown={handleMouseDown}
                    />{" "}
                    <button onClick={handleRoll}>Roll</button>{" "}
                    <button onClick={handleClose}>Close</button>{" "}
                  </div>

                  <div
                    className="modal-content-children-wrapper"
                    style={{ display: isRolled ? "none" : "block" }}
                  >
                    {children}
                  </div>
                </div>

                {isOpen && (
                  <div
                    className="modal-roll"
                    style={{
                      left: `${rolledOffsetLeft}px`,
                      backgroundColor: isRolled ? "#fff" : "#00ffff",
                    }}
                  >
                    <span className="modal-roll-title">{title}</span>
                    {isRolled && (
                      <button
                        className="modal-roll-unroll-button"
                        onClick={handleUnRoll}
                      >
                        Unroll
                      </button>
                    )}
                  </div>
                )}
              </>
            )
          }
        </Transition>
      </Portal>
    );
  }
);

/*
TODO DnD
React 18 и их апи по анимациям
*/
