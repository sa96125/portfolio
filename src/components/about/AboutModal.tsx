import styled from "@emotion/styled";
import { useEffect } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";

export default function AboutModal() {
  const isOpen = useGlobalStore((s) => s.isAboutOpen);
  const close = useGlobalStore((s) => s.closeAbout);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={close}>
      <Panel onClick={(e) => e.stopPropagation()}>
        {/* Traffic Lights */}
        <TrafficLights>
          <TrafficBtn color="#FF5F57" onClick={close} />
          <TrafficBtn color="#FEBC2E" />
          <TrafficBtn color="#28C840" />
        </TrafficLights>

        <Body>
          {/* 프로필 사진 */}
          <ProfilePhoto src="/docs/박종승_여권사진.jpg" alt="박종승" draggable={false} />

          <Name>박종승</Name>
          <Role>Full-Stack Engineer</Role>

          {/* 소개 */}
          <Intro>
            박종승의 인터랙티브 포트폴리오입니다.
            <br />
            제가 좋아하는 macOS 데스크탑을 모티브로, 이력서 한 장으로는 다 담지 못한, 개발자로서의 다양한 모습을 이 공간을 통해 보여드리고 싶었습니다.
            곳곳에 이스터에그를 숨겨 놨으니, 천천히 둘러보며 즐겨주세요 :)
          </Intro>

          {/* 스펙 테이블 */}
          <SpecTable>
            <SpecRow>
              <SpecLabel>Stack</SpecLabel>
              <SpecValue>React 19 · TypeScript · Vite 7</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>State</SpecLabel>
              <SpecValue>Zustand · TanStack Query</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>Style</SpecLabel>
              <SpecValue>Emotion</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>Pattern</SpecLabel>
              <SpecValue>Atomic · Compound</SpecValue>
            </SpecRow>
            <SpecRow>
              <SpecLabel>Design</SpecLabel>
              <SpecValue>Liquid Glass (macOS Tahoe)</SpecValue>
            </SpecRow>
          </SpecTable>
        </Body>
      </Panel>
    </Overlay>
  );
}

/* ── 레이아웃 ── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled.div`
  width: 460px;
  position: relative;
  background: rgba(30, 30, 32, 0.82);
  backdrop-filter: blur(60px) saturate(180%);
  -webkit-backdrop-filter: blur(60px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.3),
    0 24px 70px rgba(0, 0, 0, 0.45);
  overflow: hidden;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const TrafficBtn = styled.button<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.color};
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  padding: 0;
  transition: filter 0.1s;

  &:hover {
    filter: brightness(0.85);
  }
`;

const Body = styled.div`
  padding: 48px 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ── 프로필 사진 ── */

const ProfilePhoto = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

/* ── 텍스트 ── */

const Name = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #f5f5f7;
  letter-spacing: -0.3px;
  text-align: center;
`;

const Role = styled.p`
  font-size: 12px;
  color: #86868b;
  margin-top: 2px;
  margin-bottom: 18px;
  text-align: center;
`;

const Intro = styled.p`
  font-size: 12px;
  color: #a1a1a6;
  line-height: 1.7;
  margin-bottom: 28px;
  text-align: left;
  width: 100%;
`;


/* ── 스펙 테이블 ── */

const SpecTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
`;

const SpecLabel = styled.span`
  color: #f5f5f7;
  font-weight: 600;
  text-align: right;
  min-width: 60px;
`;

const SpecValue = styled.span`
  color: #a1a1a6;
  text-align: left;
  min-width: 180px;
`;

