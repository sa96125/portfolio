export interface FolderEntry {
  name: string;
  locked?: boolean;
}

export interface SidebarSection {
  label: string;
  folders: FolderEntry[];
}

export interface FileItem {
  name: string;
  dateModified: string;
  size: string;
  kind: string;
  isFolder?: boolean;
  /** docs/ 폴더 내 실제 파일명 (회사 접두어 포함) */
  docPath?: string;
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Favorites",
    folders: [
      { name: "내 문서" },
    ],
  },
  {
    label: "Career",
    folders: [
      { name: "TC인텔리전스" },
      { name: "텍슨" },
      { name: "오큐브", locked: true },
      { name: "노크" },
      { name: "수자원공사(계약)", locked: true },
    ],
  },
];

export const FOLDER_CONTENTS: Record<string, FileItem[]> = {
  "TC인텔리전스": [
    { name: "회고-챗봇.pdf", dateModified: "Apr 28, 2026", size: "12 KB", kind: "PDF" },
    { name: "회고-도슨트네비게이션.pdf", dateModified: "Apr 28, 2026", size: "8 KB", kind: "PDF" },
    { name: "설계-데이터파이프라인-좌표수집.pdf", dateModified: "May 1, 2026", size: "2 KB", kind: "PDF" },
    { name: "설계-온톨로지-조직도.png", dateModified: "May 1, 2026", size: "186 KB", kind: "PNG", docPath: "TC-설계-온톨로지-조직도.png" },
    { name: "개발-챗봇-첨부파일요약.png", dateModified: "May 1, 2026", size: "320 KB", kind: "PNG", docPath: "TC-개발-챗봇-첨부파일요약.png" },
  ],
  "텍슨": [
    { name: "개발-IT자산시스템-인증.png", dateModified: "May 1, 2026", size: "84 KB", kind: "PNG", docPath: "텍슨-개발-IT자산시스템-인증.png" },
    { name: "개발-IT자산시스템-프론트.png", dateModified: "May 1, 2026", size: "116 KB", kind: "PNG", docPath: "텍슨-개발-IT자산시스템-프론트.png" },
    { name: "개발-IT자산시스템-백엔드(MSA).png", dateModified: "May 1, 2026", size: "174 KB", kind: "PNG", docPath: "텍슨-개발-IT자산시스템-백엔드(MSA).png" },
    { name: "유지보수-ERP-83건처리.png", dateModified: "May 1, 2026", size: "129 KB", kind: "PNG", docPath: "텍슨-유지보수-ERP-83건처리.png" },
  ],
  "오큐브": [],
  "노크": [
    { name: "개발-클라우드비전AR-QR이미지.png", dateModified: "May 1, 2026", size: "1.3 MB", kind: "PNG", docPath: "노크-개발-클라우드비전AR-QR이미지.png" },
    { name: "개발-클라우드비전AR-QR모델3D.png", dateModified: "May 1, 2026", size: "253 KB", kind: "PNG", docPath: "노크-개발-클라우드비전AR-QR모델3D.png" },
    { name: "개발-클라우드비전AR-QR동영상.png", dateModified: "May 1, 2026", size: "607 KB", kind: "PNG", docPath: "노크-개발-클라우드비전AR-QR동영상.png" },
    { name: "개발-클라우드비전AR-결제연동.png", dateModified: "May 1, 2026", size: "1.3 MB", kind: "PNG", docPath: "노크-개발-클라우드비전AR-결제연동.png" },
    { name: "유지보수-클라우드캐스트1.png", dateModified: "May 1, 2026", size: "650 KB", kind: "PNG", docPath: "노크-유지보수-클라우드캐스트1.png" },
    { name: "유지보수-클라우드캐스트2.png", dateModified: "May 1, 2026", size: "480 KB", kind: "PNG", docPath: "노크-유지보수-클라우드캐스트2.png" },
  ],
  "수자원공사(계약)": [],

  "내 문서": [
    { name: "증명서_AWS_Certified_Developer_Associate.pdf", dateModified: "May 1, 2026", size: "49 KB", kind: "PDF", docPath: "박종승_증명서_AWS_Certified_Developer_Associate.pdf" },
    { name: "증명서_Certificate_4_in_QAT(AUS).pdf", dateModified: "May 1, 2026", size: "364 KB", kind: "PDF", docPath: "박종승_증명서_Certificate_4_in_QAT(AUS).pdf" },
  ],
};
