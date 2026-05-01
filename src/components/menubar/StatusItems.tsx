import styled from "@emotion/styled";
import { Battery, Wifi, Search } from "lucide-react";
import { useEffect, useState } from "react";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function formatTime(d: Date) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[d.getDay()];
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh < 12 ? "오전" : "오후";
  const h12 = hh % 12 || 12;
  return `${day} ${ampm} ${h12}:${mm}`;
}

export default function StatusItems() {
  const now = useClock();
  return (
    <>
      <IconBtn aria-label="Battery"><Battery size={18} strokeWidth={2} /></IconBtn>
      <IconBtn aria-label="WiFi"><Wifi size={15} strokeWidth={2.2} /></IconBtn>
      <IconBtn aria-label="Search"><Search size={15} strokeWidth={2.2} /></IconBtn>
      <Time>{formatTime(now)}</Time>
    </>
  );
}

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  color: #191f28;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const Time = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #191f28;
  letter-spacing: -0.2px;
  padding: 0 6px;
  user-select: none;
`;
