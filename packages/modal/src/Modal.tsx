import React, {
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

export const Modal = memo(
  ({ children, isOpen: isOpenProps = false, onClose, name, title }: any) => {
    const { value, setValue } = useContext(ModalContext);

    const [isOpen, setIsOpen] = useState(isOpenProps);
    const [needOverlay, setNeedOverlay] = useState(true);
    const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
    const [isRolled, setIsRolled] = useState(false);

    const portalRef = useRef<HTMLDivElement>();
    const offsetClickCoordsRef = useRef<{ x: number; y: number }>();
    const isMovedRef = useRef(false);
    const wasModevBeforeRef = useRef(false);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const needForRafRef = useRef(true);
    const isRollingRef = useRef(true);

    useEffect(() => {
      setIsOpen(isOpenProps);
    }, [isOpenProps]);

    useEffect(() => {
      if (!isOpen && !value.openedModals.includes(name)) return;
      if (isOpen && value.openedModals.includes(name)) return;

      const newOpenedModals = isOpen
        ? [...value.openedModals, name]
        : value.openedModals.filter((n) => n !== name);

      setValue({
        openedModals: newOpenedModals,
      });
    }, [isOpen, value.openedModals, name]);

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

    const handleMouseMoveRaf = useCallback(
      ({ clientX, clientY }: MouseEvent) => {
        wasModevBeforeRef.current = true;
        const offsetX = clientX - offsetClickCoordsRef.current?.x!;
        const offsetY = clientY - offsetClickCoordsRef.current?.y!;

        setModalOffset({
          x: offsetX,
          y: offsetY,
        });
        needForRafRef.current = true;
      },
      []
    );

    const handleMouseMove = useCallback((e) => {
      if (needForRafRef.current) {
        needForRafRef.current = false;
        requestAnimationFrame(() => handleMouseMoveRaf(e));
      }
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
      const idx = value.openedModals.findIndex((n) => n === name);

      return (idx === -1 ? 0 : idx) * rollWidth;
    }, [value.openedModals, name]);

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
                          left: `${rolledOffsetLeft}px`,
                        }
                      : {
                          top: `${modalOffset.y}px`,
                          left: `${modalOffset.x}px`,
                        }),
                  }}
                  onClick={handleContentClick}
                >
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
