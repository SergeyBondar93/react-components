import { createContext, FC, useCallback, useEffect, useState } from "react";
import { useLockBodyScroll } from "react-use";

interface IModalContextValue {
  openedModals: string[];
  modalsWithOverlays: string[];
}

interface IModalContext {
  modalProviderValue: IModalContextValue;
  setModalProviderValue: React.Dispatch<
    React.SetStateAction<Partial<IModalContextValue>>
  >;
}

export const defaultModalContextValue: IModalContextValue = {
  openedModals: [],
  modalsWithOverlays: [],
};

export const ModalContext = createContext<IModalContext>({} as any);

export const ModalContextProvider: FC = ({ children }) => {
  const [modalProviderValue, _setModalProviderValue] = useState(
    defaultModalContextValue
  );
  const setModalProviderValue = useCallback(
    (newValue) => {
      if (typeof newValue === "function") {
        _setModalProviderValue(newValue);
      } else {
        _setModalProviderValue({ ...modalProviderValue, ...newValue });
      }
    },
    [modalProviderValue]
  );
  useLockBodyScroll(!!modalProviderValue.modalsWithOverlays.length);

  return (
    <ModalContext.Provider
      value={{ modalProviderValue, setModalProviderValue }}
    >
      {children}
    </ModalContext.Provider>
  );
};
