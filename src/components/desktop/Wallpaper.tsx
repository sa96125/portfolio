import styled from "@emotion/styled";
import { useGlobalStore } from "../../store/useGlobalStore";

export default function Wallpaper() {
  const wallpaper = useGlobalStore((s) => s.wallpaper);
  return <Bg style={{ backgroundImage: `url("${wallpaper}")` }} />;
}

const Bg = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background: center / cover no-repeat;
`;
