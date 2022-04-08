import { useState } from "react";

import { Modal } from "../src";
import { ModalContent } from "./ModalContent";

export const InternalModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button onClick={handleOpen}>Open Internal Modal</button>
      <Modal
        onClose={() => setIsOpen(false)}
        name="two-internal"
        isOpen={isOpen}
      >
        <ModalContent name="Two" isOpen={isOpen} />
      </Modal>
    </>
  );
};
