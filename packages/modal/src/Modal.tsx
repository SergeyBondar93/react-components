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

interface MouseCoords {
  clientX: number;
  clientY: number;
}

type ResizedSides =
  | "resize-top"
  | "resize-bottom"
  | "resize-left"
  | "resize-right"
  | "move";

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
    const isMovedRef = useRef(false);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const isRollingRef = useRef(true);
    const resizeClickCoordsRef = useRef({ x: 0, y: 0 });
    const isMoveLeftSide = useRef(false);
    const isMoveTopSide = useRef(false);

    const currentMovingActionRef = useRef<ResizedSides>();

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
      if (isOpen && sizes.height === "auto") {
        setTimeout(() => {
          const { height } = modalContentRef.current?.getBoundingClientRect()!;
          const computedHeight = height / scaleModal.entering;

          setSizes({ ...sizes, height: computedHeight });
        }, 0);
      }
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

    const handlePrepareToMove = useCallback(
      ({ x, y, side }: { x: number; y: number; side?: ResizedSides }) => {
        isMovedRef.current = true;
        document.body.style.userSelect = "none";

        resizeClickCoordsRef.current = { x, y };

        currentMovingActionRef.current = side;

        window.addEventListener("mousemove", handleResize);
        window.addEventListener("mouseup", handleResizeEnd);
      },
      []
    );

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback(({ clientX, clientY }) => {
        isMoveLeftSide.current = true;
        isMoveTopSide.current = true;
        handlePrepareToMove({
          x: clientX,
          y: clientY,
          side: "move",
        });
      }, []);

    const rolledOffsetLeft = useMemo(() => {
      const idx = modalProviderValue.openedModals.findIndex(
        (modalName) => modalName === name
      );

      return (idx === -1 ? 0 : idx) * rollWidth;
    }, [modalProviderValue.openedModals, name]);

    const handleResizeTopMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        isMoveTopSide.current = true;
        handlePrepareToMove({
          x: e.clientX,
          y: e.clientY,
          side: "resize-top",
        });
      }, []);

    const handleResizeBottomMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        handlePrepareToMove({
          x: e.clientX,
          y: e.clientY,
          side: "resize-bottom",
        });
      }, []);

    const handleResizeRightMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        handlePrepareToMove({
          x: e.clientX,
          y: e.clientY,
          side: "resize-right",
        });
      }, []);

    const handleResizeLeftMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        isMoveLeftSide.current = true;
        handlePrepareToMove({
          x: e.clientX,
          y: e.clientY,
          side: "resize-left",
        });
      }, []);

    const handleResizeEnd = useCallback(() => {
      setTimeout(() => {
        isMovedRef.current = false;
      }, 100);

      let heightDiff = 0;
      setHeightDiff((oldDiff) => {
        heightDiff = oldDiff;
        return 0;
      });

      let widthDiff = 0;
      setWidthDiff((oldDiff) => {
        widthDiff = oldDiff;
        return 0;
      });

      if (currentMovingActionRef.current !== "move") {
        setSizes((s) => ({
          width: s.width + widthDiff,
          height: (s.height as number) + heightDiff,
        }));
      }

      if (currentMovingActionRef.current === "resize-top") {
        setModalOffset((offset) => {
          return {
            ...offset,
            y: offset.y - heightDiff,
          };
        });
      } else if (currentMovingActionRef.current === "resize-left") {
        setModalOffset((offset) => {
          return {
            ...offset,
            x: offset.x - widthDiff,
          };
        });
      } else if (currentMovingActionRef.current === "move") {
        setModalOffset((offset) => {
          return {
            y: offset.y - heightDiff,
            x: offset.x - widthDiff,
          };
        });
      }

      currentMovingActionRef.current = undefined;
      isMoveLeftSide.current = false;
      isMoveTopSide.current = false;
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    }, []);

    const handlersMap = useMemo(
      () => ({
        "resize-top": ({ clientY }: MouseCoords) =>
          setHeightDiff(resizeClickCoordsRef.current.y - clientY),
        "resize-bottom": ({ clientY }: MouseCoords) =>
          setHeightDiff(clientY - resizeClickCoordsRef.current.y),
        "resize-right": ({ clientX }: MouseCoords) =>
          setWidthDiff(clientX - resizeClickCoordsRef.current.x),
        "resize-left": ({ clientX }: MouseCoords) =>
          setWidthDiff(resizeClickCoordsRef.current.x - clientX),
        move: ({ clientX, clientY }: MouseCoords) => {
          setHeightDiff(resizeClickCoordsRef.current.y - clientY);
          setWidthDiff(resizeClickCoordsRef.current.x - clientX);
        },
      }),
      []
    );

    const handleResize = useCallback(
      (mouseCoords: { clientX: number; clientY: number }) => {
        handlersMap[currentMovingActionRef.current!](mouseCoords);
      },
      []
    );

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
                              : `${
                                  sizes.height +
                                  (currentMovingActionRef.current! === "move"
                                    ? 0
                                    : heightDiff)
                                }px`,

                          width: `${
                            sizes.width +
                            (currentMovingActionRef.current! === "move"
                              ? 0
                              : widthDiff)
                          }px`,
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
