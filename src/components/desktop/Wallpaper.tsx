import styled from "@emotion/styled";

export default function Wallpaper() {
  return <Bg />;
}

const Bg = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background: url("/wallpaper.jpg") center / cover no-repeat;
`;
