import styled from "@emotion/styled";
import { useState } from "react";
import { createPortal } from "react-dom";
import * as Menubar from "@radix-ui/react-menubar";
import StatusItems from "./StatusItems";
import { useGlobalStore } from "../../store/useGlobalStore";

export default function MenuBar() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
    <Bar>
      <Menubar.Root asChild>
        <Group>
          <Menubar.Menu>
            <Trigger style={{ fontWeight: 600 }}>Jongseung Park</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item onSelect={() => window.open("https://github.com/sa96125/", "_blank")}>
                  GitHub
                </Item>
                <Item onSelect={() => window.location.assign("mailto:sa96125@gmail.com")}>
                  이메일 보내기
                </Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Trigger>실행</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item onSelect={() => setShowAlert(true)}>
                  <ItemContent>
                    <ItemLabel>Tars AI 열기</ItemLabel>
                    <ItemDesc>프로젝트에 대해 질문할 수 있는 AI 어시스턴트</ItemDesc>
                  </ItemContent>
                </Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Trigger>도움말</Trigger>
            <Menubar.Portal>
              <Content sideOffset={6}>
                <Item onSelect={() => useGlobalStore.getState().openAbout()}>
                  이 사이트 소개
                </Item>
              </Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Group>
      </Menubar.Root>

      <Group>
        <StatusItems />
      </Group>
    </Bar>

    {showAlert && createPortal(
      <AlertOverlay onClick={() => setShowAlert(false)}>
        <AlertBox onClick={(e) => e.stopPropagation()}>
          <AlertTitle>Tars AI를 실행할 수 없습니다</AlertTitle>
          <AlertMessage>
            GPU 자원이 부족하여 AI 어시스턴트를<br />
            실행할 수 없습니다.
          </AlertMessage>
          <AlertBtn onClick={() => setShowAlert(false)}>
            확인
          </AlertBtn>
        </AlertBox>
      </AlertOverlay>,
      document.body
    )}
    </>
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


const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemLabel = styled.span`
  font-size: 13px;
`;

const ItemDesc = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);

  [data-highlighted] & {
    color: rgba(255, 255, 255, 0.7);
  }
`;

/* ── 시스템 경고 팝업 ── */
const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const AlertBox = styled.div`
  background: rgba(232, 230, 230, 0.75);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: 14px;
  padding: 28px 32px 20px;
  text-align: center;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.1),
    0 8px 40px rgba(0, 0, 0, 0.25);
  width: 360px;
`;

const AlertTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const AlertMessage = styled.div`
  font-size: 12px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const AlertBtn = styled.button`
  width: 100%;
  background: #e84142;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;
`;

