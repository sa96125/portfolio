import styled from "@emotion/styled";
import { ArrowUp, Square } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

interface Props {
  isRunning?: boolean;
  onSend?: (text: string) => void;
  onStop?: () => void;
}

export default function Composer({ isRunning = false, onSend, onStop }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isRunning) return;
    onSend?.(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isRunning;

  return (
    <Container>
      <InputRow>
        <Input
          ref={inputRef}
          autoFocus
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          placeholder={
            isRunning ? "답변 중..." : "메시지"
          }
        />
        {isRunning ? (
          <StopBtn type="button" onClick={onStop} aria-label="중지">
            <Square size={10} fill="currentColor" />
          </StopBtn>
        ) : (
          <SendBtn
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="전송"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </SendBtn>
        )}
      </InputRow>
    </Container>
  );
}

const Container = styled.div`
  padding: 8px 12px 12px;
  border-top: 0.5px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 6px 6px 6px 14px;
`;

const Input = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  resize: none;
  min-height: 22px;
  max-height: 120px;
  overflow-y: auto;
  color: rgba(255, 255, 255, 0.9);
  font-family: inherit;
  line-height: 1.45;
  padding: 2px 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`;

const SendBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #0a84ff;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s;

  &:disabled {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.3);
    cursor: default;
  }
`;

const StopBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ff453a;
  background: transparent;
  color: #ff453a;
  cursor: pointer;
  flex-shrink: 0;
`;
