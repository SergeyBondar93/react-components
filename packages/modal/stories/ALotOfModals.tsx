import { useCallback, useState } from "react";

// import ScrollbarWidthSpy from "@serj/scrollbar-width-spy";

import { Modal } from "../src";
import { InternalModal } from "./InternalModal";
import { Layout } from "./Layout";
import { longText } from "./longText";
import { ModalContent } from "./ModalContent";

export const ALotOfModals = () => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const [modalsState, setModalsState] = useState({
    one: false,
    two: false,
    three: false,
  });

  const handleOpenOne = () => {
    setModalsState({
      ...modalsState,
      one: true,
    });
  };
  const handleOpenTwo = () => {
    setModalsState({
      ...modalsState,
      two: true,
    });
  };
  const handleOpenThree = () => {
    setModalsState({
      ...modalsState,
      three: true,
    });
  };

  const handleClose = useCallback(
    (name: string) => {
      setModalsState({
        ...modalsState,
        [name]: false,
      });
    },
    [modalsState]
  );

  return (
    <Layout>
      <div className="content">
        <button type="button" onClick={handleOpenOne}>
          With internal modal
        </button>
        <button type="button" onClick={handleOpenTwo}>
          Second
        </button>
        <button type="button" onClick={handleOpenThree}>
          Third
        </button>
        {longText}
        <Modal onClose={handleClose} name="one" isOpen={modalsState.one}>
          <InternalModal />
          <ModalContent name="One" />
          <ModalContent name="One" />
          {longText}
        </Modal>
        <Modal onClose={handleClose} name="two" isOpen={modalsState.two}>
          <ModalContent name="Two" />
        </Modal>
        <Modal onClose={handleClose} name="three" isOpen={modalsState.three}>
          <ModalContent name="Three" />
        </Modal>
      </div>
    </Layout>
  );
};
