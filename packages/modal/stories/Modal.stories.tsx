import { ALotOfModals } from "./ALotOfModals";
import { Basic } from "./Basic";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Modal",
  // component: ModalStory,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const BasicStory = () => <Basic />;
export const ALotOfModalsStory = () => <ALotOfModals />;
