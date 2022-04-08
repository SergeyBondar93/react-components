import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { ENTERED, ENTERING, EXITING } from "react-transition-group/Transition";

import { duration, opacityModal, scaleModal, opacityOverlay } from "./consts";
import { Portal } from "./Portal";

import "./style.css";

export const Modal = memo(
  ({ children, isOpen: isOpenProps = false, onClose, name }: any) => {
    const [isOpen, setIsOpen] = useState(isOpenProps);
    const portalRef = useRef<HTMLDivElement>();

    useEffect(() => {
      setIsOpen(isOpenProps);
    }, [isOpenProps]);

    const handleClose: React.MouseEventHandler<
      HTMLDivElement | HTMLButtonElement
    > = useCallback(() => {
      onClose(name);
    }, [onClose, name]);

    const handleContentClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
    };

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
                  style={{
                    transition: `${duration}ms`,
                    transform: `scale(${scaleModal[state]}) `,
                    opacity: opacityModal[state],
                  }}
                  onClick={handleContentClick}
                >
                  <div className="modal-close-button-wrapper">
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
