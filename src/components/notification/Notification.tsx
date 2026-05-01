import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function Notification({ show, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    return () => clearTimeout(exitTimer.current);
  }, []);

  const dismiss = useCallback(() => {
    setExiting(true);
    clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!visible) return null;

  return (
    <Banner data-exiting={exiting}>
      <CloseBtn onClick={dismiss}>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M1,1 L7,7 M7,1 L1,7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </CloseBtn>
      <IconArea>
        <TarsIcon src="/tars.gif" alt="Tars AI" draggable={false} />
      </IconArea>
      <TextArea>
        <Title>Tars AI</Title>
        <Body>
          최적의 경험을 위해, 전체화면으로 보시는 걸 추천드려요.
        </Body>
        <Shortcut>Windows: F11 &nbsp;|&nbsp; Mac: ⌃⌘F</Shortcut>
      </TextArea>
    </Banner>
  );
}

const slideIn = keyframes`
  from { transform: translateX(calc(100% + 20px)); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(calc(100% + 20px)); opacity: 0; }
`;


const Banner = styled.div`
  position: fixed;
  top: 40px;
  right: 16px;
  z-index: 1500;
  width: 340px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(30, 30, 32, 0.82);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.35);
  animation: ${slideIn} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  &[data-exiting="true"] {
    animation: ${slideOut} 0.3s ease-in forwards;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
`;

const IconArea = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TarsIcon = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
`;

const TextArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #f5f5f7;
  margin-bottom: 4px;
`;

const Body = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
`;

const Shortcut = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 6px;
`;
