import styled from "@emotion/styled";

export default function WelcomeMessage() {
  return (
    <Row>
      <Bubble>
        박종승님의 AI 비서입니다. 저는 인터스텔라에 나오는 AI로봇에서 영감을 받아 만들어졌어요. 시스템에 있는 노트 정보를 기반으로 답변합니다. GPU 자원의 부족으로 정지될 수 있습니다. 하지만 네트워크가 없는 환경에서도 동작 가능하도록 최소한의 리소스로 운영되고 있어요.
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
