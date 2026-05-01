import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
`;

export const Page = styled.div`
  padding: 48px 80px;
  font-family: "Noto Sans KR", -apple-system, sans-serif;
  color: #1d1d1f;
`;

export const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #1d1d1f;
`;

export const TagLine = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0 0 16px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0 0 24px;
`;

export const SectionDivider = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 0;
  margin: 8px 0 20px;
  border-top: 2px solid #1d1d1f;
`;

export const MetricRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
`;

export const Metric = styled.div`
  flex: 1;
  background: #f7f7f8;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

export const MetricValue = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: #0058d0;
`;

export const MetricLabel = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
`;

export const Section = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px;
`;

export const StepTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #0058d0;
  margin: 0 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
`;

export const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin: 0 0 8px;
`;

export const Text = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #444;
  margin: 0 0 8px;

  strong {
    color: #1d1d1f;
  }
`;

export const List = styled.ul`
  margin: 0 0 8px;
  padding-left: 20px;
  font-size: 15px;
  line-height: 1.8;
  color: #444;
`;

export const CdrBlock = styled.div`
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 2px solid #e0e0e0;
`;

export const CdrLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const PlusMinusList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 15px;
  line-height: 1.8;
  color: #444;
  list-style: none;

  li::before {
    margin-left: -18px;
    margin-right: 6px;
  }
  li[data-type="plus"]::before {
    content: "+";
    color: #28a745;
    font-weight: 700;
  }
  li[data-type="minus"]::before {
    content: "−";
    color: #d32f2f;
    font-weight: 700;
  }
`;

export const NextArrow = styled.div`
  font-size: 13px;
  color: #0058d0;
  margin-top: 4px;
  font-style: italic;
`;
