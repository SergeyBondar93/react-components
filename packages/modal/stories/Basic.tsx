import { useCallback, useState } from "react";

import ScrollbarWidthSpy from "@serj/scrollbar-width-spy";

import { Modal } from "../src";
import { longText } from "./longText";
import { ModalContent } from "./ModalContent";
import { Layout } from "./Layout";

export function Basic() {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const [modalState, setModalState] = useState(false);

  const handleOpenModal = useCallback(() => {
    setModalState(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalState(false);
  }, []);

  return (
    <Layout>
      <div className="content">
        <button type="button" onClick={handleOpenModal}>
          Open Modal
        </button>
        {longText}
        <Modal onClose={handleClose} name="modal" isOpen={modalState}>
          <ModalContent name="Modal" />
        </Modal>
      </div>
    </Layout>
  );
}
