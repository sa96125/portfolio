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
  /** 더블클릭 시 Safari에서 열 URL */
  url?: string;
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: "Favorites",
    folders: [
      { name: "내 문서" },
      { name: "워크스페이스" },
    ],
  },
  {
    label: "Career",
    folders: [
      { name: "TC인텔리전스" },
      { name: "텍슨" },
      { name: "오큐브", locked: true },
      { name: "노크" },
    ],
  },
];

export const FOLDER_CONTENTS: Record<string, FileItem[]> = {
  "TC인텔리전스": [
    { name: "회고-챗봇.pdf", dateModified: "Apr 28, 2026", size: "12 KB", kind: "PDF" },
    { name: "회고-도슨트네비게이션.pdf", dateModified: "Apr 28, 2026", size: "8 KB", kind: "PDF" },
    { name: "설계-데이터파이프라인-좌표수집.pdf", dateModified: "May 1, 2026", size: "2 KB", kind: "PDF" },
    { name: "설계-온톨로지-조직도.png", dateModified: "May 1, 2026", size: "186 KB", kind: "PNG", docPath: "j2a6d4.png" },
    { name: "개발-챗봇-첨부파일요약.png", dateModified: "May 1, 2026", size: "320 KB", kind: "PNG", docPath: "k8e1b5.png" },
  ],
  "텍슨": [
    { name: "개발-IT자산시스템-인증.png", dateModified: "May 1, 2026", size: "84 KB", kind: "PNG", docPath: "p9f2c4.png" },
    { name: "개발-IT자산시스템-프론트.png", dateModified: "May 1, 2026", size: "116 KB", kind: "PNG", docPath: "q3a7d1.png" },
    { name: "개발-IT자산시스템-백엔드(MSA).png", dateModified: "May 1, 2026", size: "174 KB", kind: "PNG", docPath: "r5e8b6.png" },
    { name: "유지보수-ERP-83건처리.png", dateModified: "May 1, 2026", size: "129 KB", kind: "PNG", docPath: "s1c4f9.png" },
  ],
  "오큐브": [],
  "노크": [
    { name: "개발-클라우드비전AR-QR이미지.png", dateModified: "May 1, 2026", size: "1.3 MB", kind: "PNG", docPath: "t7d2a5.png" },
    { name: "개발-클라우드비전AR-QR모델3D.png", dateModified: "May 1, 2026", size: "253 KB", kind: "PNG", docPath: "u4b9e1.png" },
    { name: "개발-클라우드비전AR-QR동영상.png", dateModified: "May 1, 2026", size: "607 KB", kind: "PNG", docPath: "v2f5c8.png" },
    { name: "개발-클라우드비전AR-결제연동.png", dateModified: "May 1, 2026", size: "1.3 MB", kind: "PNG", docPath: "w8a3d6.png" },
    { name: "유지보수-클라우드캐스트1.png", dateModified: "May 1, 2026", size: "650 KB", kind: "PNG", docPath: "x1e7b4.png" },
    { name: "유지보수-클라우드캐스트2.png", dateModified: "May 1, 2026", size: "480 KB", kind: "PNG", docPath: "y5c2f9.png" },
  ],
  "워크스페이스": [
    { name: "사이드프로젝트9-api", dateModified: "May 2, 2026", size: "—", kind: "Link", url: "https://beep-production-7c5e.up.railway.app/swagger-ui/index.html" },
  ],
  "내 문서": [
    { name: "증명서_AWS_Certified_Developer_Associate.pdf", dateModified: "May 1, 2026", size: "49 KB", kind: "PDF", docPath: "d4a1b7.pdf" },
    { name: "증명서_Certificate_4_in_QAT(AUS).pdf", dateModified: "May 1, 2026", size: "364 KB", kind: "PDF", docPath: "e8c3f6.pdf" },
  ],
};
