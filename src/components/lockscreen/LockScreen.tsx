import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  onUnlock: () => void;
}

const PRELOAD_RESOURCES = [
  "/wallpaper.jpg",
  "/docs/박종승_여권사진.jpg",
  "/docs/박종승_프로필.jpeg",
  "/dock-icons/finder.png",
  "/dock-icons/safari.png",
  "/dock-icons/vscode.png",
  "/dock-icons/docker.png",
  "/dock-icons/claude.png",
  "/dock-icons/intellij.png",
  "/dock-icons/datagrip.png",
  "/dock-icons/photos.png",
  "/dock-icons/notes.png",
  "/dock-icons/music.png",
  "/dock-icons/mail.png",
  "/dock-icons/messages.png",
  "/dock-icons/folder.png",
  "/dock-icons/settings.png",
];

const MIN_DURATION = 3000;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function LockScreen({ onUnlock }: Props) {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const realProgress = useRef(0);
  const resourcesDone = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleClick = useCallback(() => {
    if (loading || unlocking) return;
    setLoading(true);
    realProgress.current = 0;
    resourcesDone.current = false;

    let loaded = 0;
    const total = PRELOAD_RESOURCES.length;

    PRELOAD_RESOURCES.forEach((src) =>
      preloadImage(src).then(() => {
        loaded++;
        realProgress.current = loaded / total;
        if (loaded === total) resourcesDone.current = true;
      })
    );

    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / MIN_DURATION, 1);

      // 거의 linear에 가깝지만 시작·끝만 살짝 부드러운 커브
      const eased = t < 0.02 ? t * 25 * t : t;

      if (resourcesDone.current && t >= 1) {
        setProgress(1);
        setTimeout(() => {
          setUnlocking(true);
          setTimeout(onUnlock, 600);
        }, 500);
        return;
      }

      setProgress(resourcesDone.current ? Math.max(eased, realProgress.current) : eased);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [loading, unlocking, onUnlock]);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayName = dayNames[time.getDay()];
  const monthName = monthNames[time.getMonth()];
  const date = time.getDate();
  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");

  return (
    <Container data-unlocking={unlocking} onClick={handleClick}>
      <Bg />

      <ClockArea>
        <DateText>{dayName}, {monthName} {date}</DateText>
        <Time>{hours}:{minutes}</Time>
      </ClockArea>

      {/* 사용자 영역 — 화면 하단 */}
      <UserArea>
        <Avatar>
          <AvatarImg src="/docs/박종승_여권사진.jpg" alt="박종승" draggable={false} />
        </Avatar>
        <UserName>박종승</UserName>

        <Hint>Click to enter portfolio</Hint>

        <BarTrack style={{ opacity: loading ? 1 : 0 }}>
          <BarFill style={{ width: `${progress * 100}%` }} />
        </BarTrack>
      </UserArea>
    </Container>
  );
}

const fadeOut = keyframes`
  to { opacity: 0; transform: scale(1.04); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;

  &[data-unlocking="true"] {
    animation: ${fadeOut} 0.6s ease-out forwards;
    pointer-events: none;
  }
`;

const Bg = styled.div`
  position: absolute;
  inset: 0;
  background: url("/wallpaper.jpg") center / cover no-repeat;
  filter: brightness(0.65) saturate(1.1);
`;

const ClockArea = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 14vh;
  text-align: center;
`;

const DateText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.2px;
`;

const Time = styled.div`
  font-size: 96px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -2px;
  line-height: 1;
  margin-top: 2px;
  text-shadow:
    0 0 40px rgba(255, 255, 255, 0.15),
    0 0 80px rgba(255, 255, 255, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.2);
`;

const UserArea = styled.div`
  position: relative;
  z-index: 1;
  margin-top: auto;
  margin-bottom: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a8b8d8 0%, #6e8cbe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.25);
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-top: 8px;
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
`;

const Hint = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 4px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const BarTrack = styled.div`
  width: 182px;
  height: 5px;
  border-radius: 2.5px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
  margin-top: 12px;
  transition: opacity 0.3s ease;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 2.5px;
  background: #fff;
  transition: width 0.3s ease-out;
`;
