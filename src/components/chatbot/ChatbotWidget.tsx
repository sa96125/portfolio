import styled from "@emotion/styled";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import MessageList from "./MessageList";
import Composer from "./Composer";

export default function ChatbotWidget() {
  const isOpen = useGlobalStore((s) => s.isChatbotOpen);
  const closeChatbot = useGlobalStore((s) => s.closeChatbot);
  const addMessage = useGlobalStore((s) => s.addMessage);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (target.closest("[data-chatbot-trigger]")) return;
      if (target.closest('[role="menu"]')) return;
      closeChatbot();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, closeChatbot]);

  const handleSend = useCallback(
    (text: string) => {
      addMessage("user", text);
      setIsTyping(true);

      // dummy AI response
      setTimeout(() => {
        addMessage(
          "assistant",
          "감사합니다! 아직 AI 연동 전이라 더미 응답이에요. 곧 실제 답변을 드릴 수 있도록 준비하겠습니다."
        );
        setIsTyping(false);
      }, 1200);
    },
    [addMessage]
  );

  return (
    <Panel ref={panelRef} data-open={isOpen} aria-hidden={!isOpen}>
      <Header>
        <HeaderTitle>메시지</HeaderTitle>
        <CloseBtn type="button" onClick={closeChatbot} aria-label="닫기">
          <X size={14} />
        </CloseBtn>
      </Header>

      <MessageList isTyping={isTyping} />

      <Composer onSend={handleSend} isRunning={isTyping} />
    </Panel>
  );
}

const Panel = styled.aside`
  position: fixed;
  top: calc(28px + 12px);
  right: 12px;
  width: 380px;
  height: 500px;
  background: rgba(30, 30, 30, 0.72);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.3),
    0 20px 50px rgba(0, 0, 0, 0.45);
  z-index: 1100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: top right;

  opacity: 0;
  transform: translateY(-8px) scale(0.96);
  pointer-events: none;
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);

  &[data-open="true"] {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 14px 16px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
`;

const HeaderTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 12px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.8);
  }
`;
