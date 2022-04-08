import { useState } from "react";

export const ModalContent = ({ name }: any) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button type="button" onClick={() => setCount(count + 1)}>
        +
      </button>
      <button type="button" onClick={() => setCount(count - 1)}>
        -
      </button>
      Modal {name} Content
      <p>Count: {count}</p>
    </div>
  );
};
