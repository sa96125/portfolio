import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import * as Menubar from "@radix-ui/react-menubar";
import { useGlobalStore } from "../../store/useGlobalStore";
import StatusItems from "./StatusItems";

export default function MenuBar() {
  const isOpen = useGlobalStore((s) => s.isChatbotOpen);
  const toggleChatbot = useGlobalStore((s) => s.toggleChatbot);

  return (
    <Bar>
      <Menubar.Root asChild>
        <Group>
          <Menubar.Menu>
            <Trigger style={{ fontWeight: 600 }}>Jongseung Park</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item onSelect={() => useGlobalStore.getState().openAbout()}>
                  이 사이트 소개
                </Item>
                <Separator />
                <Item onSelect={() => window.open("https://github.com", "_blank")}>
                  GitHub
                </Item>
                <Item onSelect={() => window.location.assign("mailto:sa96125@gmail.com")}>
                  이메일 보내기
                </Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Trigger>파일</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item disabled>
                  새 폴더<Shortcut>⇧⌘N</Shortcut>
                </Item>
                <Item disabled>
                  열기...<Shortcut>⌘O</Shortcut>
                </Item>
                <Separator />
                <Item disabled>
                  닫기<Shortcut>⌘W</Shortcut>
                </Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Trigger>보기</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item onSelect={toggleChatbot}>
                  {isOpen ? "챗봇 닫기" : "챗봇 열기"}
                </Item>
                <Separator />
                <Item onSelect={() => window.location.reload()}>
                  새로고침<Shortcut>⌘R</Shortcut>
                </Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Trigger>도움말</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item disabled>도움말 — 준비 중</Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Group>
      </Menubar.Root>

      <Group>
        <StatusItems />
        <ChatbotTrigger
          type="button"
          data-chatbot-trigger
          data-active={isOpen}
          onClick={toggleChatbot}
          aria-label="Toggle Siri"
        >
          <SiriOrb />
        </ChatbotTrigger>
      </Group>
    </Bar>
  );
}

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: linear-gradient(
    180deg,
    rgba(248, 243, 232, 0.55) 0%,
    rgba(248, 243, 232, 0.3) 100%
  );
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
`;

const Trigger = styled(Menubar.Trigger)`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  color: #191f28;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &[data-state="open"] {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const Content = styled(Menubar.Content)`
  min-width: 220px;
  background: rgba(40, 40, 42, 0.65);
  backdrop-filter: blur(80px) saturate(200%);
  -webkit-backdrop-filter: blur(80px) saturate(200%);
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.3),
    0 12px 40px rgba(0, 0, 0, 0.35);
  padding: 4px;
  z-index: 1000;
  animation: dropdownIn 0.12s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Item = styled(Menubar.Item)`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: default;
  outline: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &[data-highlighted] {
    background: #3478F6;
    color: #fff;
  }
  &[data-disabled] {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const Shortcut = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  margin-left: 24px;

  [data-highlighted] > & {
    color: rgba(255, 255, 255, 0.7);
  }
  [data-disabled] > & {
    color: rgba(255, 255, 255, 0.15);
  }
`;

const Separator = styled(Menubar.Separator)`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 10px;
`;

const ChatbotTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background: transparent;
  border: none;
  transition:
    background 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  &[data-active="true"] {
    background: rgba(0, 0, 0, 0.12);
  }
  &:active {
    transform: scale(0.92);
  }
`;

const orbSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SiriOrb = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 107, 157, 0.95), transparent 55%),
    radial-gradient(circle at 75% 35%, rgba(192, 132, 252, 0.9), transparent 55%),
    radial-gradient(circle at 50% 75%, rgba(6, 182, 212, 0.85), transparent 60%),
    conic-gradient(
      from 0deg,
      #ff6b9d 0%,
      #c084fc 25%,
      #6366f1 50%,
      #06b6d4 75%,
      #ff6b9d 100%
    );
  box-shadow:
    0 0 8px rgba(192, 132, 252, 0.55),
    inset 0 0 4px rgba(255, 255, 255, 0.5);
  animation: ${orbSpin} 6s linear infinite;
`;
