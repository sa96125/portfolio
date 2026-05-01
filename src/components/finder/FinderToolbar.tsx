import styled from "@emotion/styled";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  List,
  Search,
  Share,
  Tag,
  MoreHorizontal,
} from "lucide-react";

export default function FinderToolbar() {
  return (
    <FToolbar>
      <FToolbarLeft>
        <FNavBtn disabled>
          <ChevronLeft size={16} />
        </FNavBtn>
        <FNavBtn disabled>
          <ChevronRight size={16} />
        </FNavBtn>
        <FTitle>프로젝트</FTitle>
      </FToolbarLeft>
      <FToolbarRight>
        <FToolBtn>
          <List size={14} />
          <ChevronDown size={10} />
        </FToolBtn>
        <FToolBtn>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="1" y="9" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="9" y="1" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="9" y="9" width="4" height="4" rx="1" fill="currentColor" />
          </svg>
          <ChevronDown size={10} />
        </FToolBtn>
        <FToolBtn><Share size={14} /></FToolBtn>
        <FToolBtn><Tag size={14} /></FToolBtn>
        <FToolBtn><MoreHorizontal size={14} /><ChevronDown size={10} /></FToolBtn>
        <FSearchBox>
          <Search size={12} />
        </FSearchBox>
      </FToolbarRight>
    </FToolbar>
  );
}

const FToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: 12px;
  pointer-events: none;

  button {
    pointer-events: auto;
  }
`;

const FToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FNavBtn = styled.button`
  background: none;
  border: none;
  color: ${(p: { disabled?: boolean }) => (p.disabled ? "#666" : "#bbb")};
  padding: 2px 4px;
  cursor: ${(p: { disabled?: boolean }) => (p.disabled ? "default" : "pointer")};
  display: flex;
  align-items: center;
  border-radius: 4px;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const FTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-left: 6px;
`;

const FToolBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  padding: 4px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ccc;
  }
`;

const FSearchBox = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
  color: #777;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
