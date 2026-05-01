import styled from "@emotion/styled";

export default function WelcomeMessage() {
  return (
    <Row>
      <Bubble>
        안녕하세요! 포트폴리오에 대해 궁금한 점을 물어보세요.
      </Bubble>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 2px 16px;
`;

const Bubble = styled.div`
  max-width: 75%;
  padding: 8px 14px;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.45;
`;
