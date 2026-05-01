import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useEffect, useRef } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import MessageBubble from "./MessageBubble";
import WelcomeMessage from "./WelcomeMessage";

interface Props {
  isTyping?: boolean;
}

export default function MessageList({ isTyping = false }: Props) {
  const messages = useGlobalStore((s) => s.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <Container>
      <WelcomeMessage />
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isTyping && (
        <TypingRow>
          <TypingBubble>
            <Dot style={{ animationDelay: "0ms" }} />
            <Dot style={{ animationDelay: "160ms" }} />
            <Dot style={{ animationDelay: "320ms" }} />
          </TypingBubble>
        </TypingRow>
      )}
      <div ref={bottomRef} />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 8px 0;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TypingRow = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 2px 16px;
`;

const TypingBubble = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  padding: 10px 16px;
`;

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
  30% { transform: translateY(-4px); opacity: 0.8; }
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  animation: ${bounce} 1.2s ease-in-out infinite;
`;
