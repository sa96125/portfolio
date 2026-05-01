import styled from "@emotion/styled";

interface Props {
  src: string;
  alt?: string;
}

/** macOS 미리보기(Preview) 스타일 이미지 뷰어 */
export default function ViewerApp({ src, alt }: Props) {
  return (
    <Container>
      <Image src={src} alt={alt ?? ""} draggable={false} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
`;
