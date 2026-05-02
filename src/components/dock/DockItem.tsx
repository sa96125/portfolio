import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { memo, type ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
  scale?: number;
  isActive?: boolean;
  badge?: number;
  bounce?: boolean;
  onClick?: () => void;
}

export default memo(function DockItem({ label, icon, scale = 1, isActive, badge, bounce, onClick }: Props) {
  return (
    <Wrapper
      onClick={onClick}
      aria-label={label}
      style={{ "--dock-scale": scale } as React.CSSProperties}
    >
      <IconBox data-bounce={bounce || undefined}>{icon}</IconBox>
      {badge != null && badge > 0 && (
        <Badge style={{ transform: `scale(${1 / scale})` }}>
          {badge > 99 ? "99+" : badge}
        </Badge>
      )}
      <Label>{label}</Label>
      {isActive && <Dot />}
    </Wrapper>
  );
});

const dockBounce = keyframes`
  0%   { transform: translateY(0); }
  20%  { transform: translateY(-24px); }
  40%  { transform: translateY(0); }
  55%  { transform: translateY(-12px); }
  70%  { transform: translateY(0); }
  82%  { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const Wrapper = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transform: scale(var(--dock-scale, 1));
  transform-origin: bottom center;
  transition: transform 0.12s ease-out;
  -webkit-tap-highlight-color: transparent;

  &:hover > span {
    opacity: 1;
    transform: translateX(-50%) translateY(-6px) scale(calc(1 / var(--dock-scale, 1)));
  }

  /* 아이콘 bounce on click */
  &:active > div:first-of-type {
    transform: translateY(-8px);
  }
`;

const IconBox = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* macOS 아이콘 리플렉션 힌트 */
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));

  &[data-bounce] {
    animation: ${dockBounce} 0.8s ease-in-out;
    animation-iteration-count: 3;
  }

  svg {
    display: block;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ff3b30;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform-origin: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const Label = styled.span`
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%) translateY(0) scale(calc(1 / var(--dock-scale, 1)));
  background: rgba(30, 30, 30, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.15s,
    transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  /* 말풍선 꼬리 */
  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(30, 30, 30, 0.82);
  }
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: -8px;
`;
