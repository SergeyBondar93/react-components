import { TransitionStatus } from "react-transition-group";

export const duration = 400;

export const rollWidth = 200;

type TransitionStatusMaps = {
  [key in TransitionStatus]: number;
};

export const defaultModalSizes = {
  width: 500,
  height: "auto",
} as const;

export const defaultModalOffset = { x: 0, y: 0 };

export const scaleModal: TransitionStatusMaps = {
  entering: 0.8,
  entered: 1,
  exiting: 0.5,
  exited: 0.8,
  unmounted: 0,
};

export const opacityModal: TransitionStatusMaps = {
  entering: 0,
  entered: 1,
  exiting: 0.6,
  exited: 0.6,
  unmounted: 0,
};

export const opacityOverlay: TransitionStatusMaps = {
  entering: 0,
  entered: 1,
  exiting: 0,
  exited: 0,
  unmounted: 0,
};
