import styled from "styled-components";

import { duration, rollWidth } from "./consts";

const Resizer = styled.div`
  position: absolute;
`;
const ResizerVertical = styled(Resizer)`
  height: 7px;
  width: 100%;
  cursor: n-resize;
`;

const ResizerHorizontal = styled(Resizer)`
  width: 7px;
  height: 100%;
  cursor: e-resize;
`;

export const ResizerTop = styled(ResizerVertical)`
  top: 0px;
`;
export const ResizerBottom = styled(ResizerVertical)`
  bottom: 0px;
`;
export const ResizerLeft = styled(ResizerHorizontal)`
  left: 0px;
`;
export const ResizerRight = styled(ResizerHorizontal)`
  right: 0px;
`;

interface IModalOverlayProps {
  opacity: number;
}

export const ModalOverlay = styled.div.attrs<IModalOverlayProps>(
  ({ opacity }) => ({
    style: {
      opacity,
    },
  })
)<IModalOverlayProps>`
  top: 0px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  opacity: 1;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  transition: ${duration}ms;
`;

interface IRolledTag {
  left: number;
  isRolled: boolean;
}

export const RolledTag = styled.div<IRolledTag>`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
  box-sizing: border-box;
  transition: 0.4s;
  top: calc(100% - 30px);
  width: 200px;
  position: fixed;
  border: 1px solid black;
  z-index: 1;
  left: ${({ left }) => `${left}px`};
  background-color: ${({ isRolled }) => (isRolled ? "#fff" : "#00ffff")};
`;

export const RolledTitle = styled.div`
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface IModalContentProps {
  isRolling: boolean;
  scale: number;
  opacity: number;
  maxHeight: string | undefined;
  rolledOffsetLeft: number;
  isRolled: boolean;
  height: string;
  width: string;
  top: string;
  left: string;
}

export const ModalContent = styled.div.attrs<IModalContentProps>(
  ({
    isRolling,
    scale,
    opacity,
    height,
    width,
    top,
    left,
    maxHeight,
    isRolled,
    rolledOffsetLeft,
  }) => ({
    style: {
      transitionProperty: isRolling
        ? "transform, top, left, width, height"
        : "transform",
      transform: `scale(${scale})`,
      opacity,
      maxHeight,

      ...(isRolled
        ? {
            top: "105%",
            height: "30px",
            width: `${rollWidth}px`,
            left: `${rolledOffsetLeft}px`,
          }
        : {
            height,
            width,
            top,
            left,
          }),
    },
  })
)<IModalContentProps>`
  min-height: 200px;
  overflow: hidden;
  border: 1px solid black;
  background-color: white;
  position: fixed;
  top: 100px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 3;
  transition: ${duration}ms;
`;

export const HeaderMovableZone = styled.div`
  cursor: grab;
  flex-grow: 1;
`;

interface IChildrenWrapperProps {
  isRolled: boolean;
}

export const ChildrenWrapper = styled.div<IChildrenWrapperProps>`
  overflow: auto;
  padding: 8px;
  display: ${({ isRolled }) => (isRolled ? "none" : "block")};
`;

export const CloseButtonWrapper = styled.div`
  display: flex;
  padding: 4px;
  border-bottom: 1px solid #cfcfca;
  width: 100%;
  height: 30px;
  box-sizing: border-box;
`;
