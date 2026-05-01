import styled from "@emotion/styled";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../../store/useGlobalStore";

interface Props {
  message: Message;
}

export default memo(function MessageBubble({ message }: Props) {
  const isSent = message.role === "user";

  return (
    <Row data-sent={isSent}>
      <Bubble data-sent={isSent}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </Bubble>
    </Row>
  );
});

const Row = styled.div`
  display: flex;
  padding: 2px 16px;

  &[data-sent="true"] {
    justify-content: flex-end;
  }
  &[data-sent="false"] {
    justify-content: flex-start;
  }
`;

const Bubble = styled.div`
  max-width: 75%;
  padding: 8px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.45;
  word-break: break-word;

  /* sent (user) */
  &[data-sent="true"] {
    background: #0a84ff;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  /* received (assistant) */
  &[data-sent="false"] {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.9);
    border-bottom-left-radius: 4px;
  }

  /* markdown reset */
  p {
    margin: 0;
  }
  p + p {
    margin-top: 6px;
  }
  code {
    font-size: 12px;
    background: rgba(255, 255, 255, 0.1);
    padding: 1px 4px;
    border-radius: 4px;
  }
  pre {
    margin: 6px 0;
    padding: 8px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    overflow-x: auto;
    code {
      background: none;
      padding: 0;
    }
  }
  a {
    color: #64d2ff;
    text-decoration: underline;
  }
  ul,
  ol {
    margin: 4px 0;
    padding-left: 18px;
  }
`;
