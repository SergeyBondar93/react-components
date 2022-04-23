import { createContext, FC, useState } from "react";

interface IModalContextValue {
  openedModals: string[];
}

interface IModalContext {
  value: IModalContextValue;
  setValue: React.Dispatch<React.SetStateAction<IModalContextValue>>;
}

export const defaultModalContextValue: IModalContextValue = {
  openedModals: [],
};

export const ModalContext = createContext<IModalContext>({} as any);

export const ModalContextProvider: FC = ({ children }) => {
  const [value, setValue] = useState(defaultModalContextValue);

  return (
    <ModalContext.Provider value={{ value, setValue }}>
      {children}
    </ModalContext.Provider>
  );
};
