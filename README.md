<img width="1000" height="666" alt="mockupImage" src="https://github.com/user-attachments/assets/e4236023-fc36-456e-90be-a4089f1ef59f" />

# 🎤 한 번 더 부르고 싶은 곡을 모아두는 나만의 노래방 기록, 앵콜!

> 노래방에서 부를 노래 기록, 셋리스트 구성까지-

<br/>

## 🎯 서비스 소개

**en.core**는 노래방에서 부를 노래를 기록하고 관리하는 서비스입니다. 부를 노래를 메모장에 적어두거나 음악 앱에서 하나씩 찾던 것이 불편해, 애창곡 관리부터 셋리스트 구성까지 한 곳에서 해결하고자 제작했습니다.

오늘의 셋리스트를 앵콜과 함께 준비해보세요 🪩🎵

🔗 **배포 링크**: [https://encore-room.vercel.app/](https://encore-room.vercel.app/)

<br/><br/><br/>

## ✨ 주요 기능

### 🩷 나의 애창곡 관리

- 저장한 애창곡 목록과 개수, 나중에 부를 곡 개수를 한눈에 확인
- `곡 추가` 버튼으로 곡을 직접 입력하거나 저장된 곡을 눌러 수정/삭제
- 곡 제목·가수 검색창과 분위기/상황 태그 필터, 나중에 부를 곡 필터 제공
- 저장된 곡이 없을 땐 검색 또는 직접 추가로 안내하는 빈 화면 표시

### 🔍 노래방 검색

- **TJ / 금영** 노래방 브랜드 선택
- API 호출 시 곡 제목·가수를 동시에 검색해 결과를 병합, 중복 제거, 정렬하여 표시
- 검색 결과의 곡을 눌러 애창곡으로 바로 추가 (이미 추가된 곡은 표시)
- 검색 전에는 **이번 주 신곡** 목록 노출
- 검색 결과 없음 / 검색 실패 / 로딩 상태를 각각 안내

### 🎲 셋리스트 만들기

- **랜덤 모드**: 태그로 필터링 후 원하는 곡 수만큼 랜덤으로 뽑기 / 다시 뽑기
- **선택 모드**: 애창곡 중에서 직접 골라 셋리스트 구성
- **셋리스트 유지** — 만든 셋리스트를 저장해두고, 오래된(6시간 경과) 셋리스트는 상대 시간(방금, n분 전, n시간 전)과 함께 안내

<br/>

> 💾 모든 데이터는 백엔드 없이 브라우저 `localStorage`에 저장되며, 하단 탭 기반의 모바일 우선 UI로 설계했습니다.

<br/>

## 🛠️ 기술 스택

| 구분             | 사용 기술                                                 |
| ---------------- | --------------------------------------------------------- |
| **Language**     | TypeScript                                                |
| **Framework**    | React 19                                                  |
| **Build Tool**   | Vite                                                      |
| **State**        | Zustand                                                   |
| **Styling**      | Tailwind CSS v4                                           |
| **Icons**        | Tabler Icons                                              |
| **External API** | [manana.kr 노래방 API](https://api.manana.kr) (TJ · 금영) |

<br/>

## 💡 기술 선택 이유

### TypeScript

- 노래 데이터의 형태가 (검색 API 응답, 직접 입력, 저장된 곡 등) 제각각이라 형태를 안전하게 보장하기 위해서 사용했습니다.

### Zustand

- 가벼운 크기와 함께, `persist` 미들웨어로 localStorage 자동 저장 및 복원이 가능한 점이 좋았습니다. 백엔드 없이 가볍게 localStorage에 데이터를 저장하는 것이 이번 목표였는데, 스토어 상태가 바뀔 때마다 브라우저 저장소에 자동으로 저장 및 복원되는 것이 편해보였습니다.
- `useState`는 해당 컴포넌트 안에서만 바뀌지만, Zustand는 어느 컴포넌트든 구독이 가능한 점이 좋았습니다.
- `useStore(state => state.songs)`처럼 상태 객체를 부분적으로 가져오는 등 불필요한 리렌더를 줄일 수 있었습니다.

### Tailwind CSS v4

- css 파일을 따로 만들지 않고 한 파일 안에서, 그리고 각 요소 가까이에서 빠르게 스타일을 적용할 수 있는 것이 좋아 사용하게 되었습니다.

<br/>

## 📁 프로젝트 구조

```
en.core/
├── public/                     # 정적 파일 (로고, 파비콘)
├── src/
│   ├── components/             # 재사용 UI 컴포넌트
│   │   ├── AddSongDrawer.tsx       # 애창곡 추가·수정 드로어
│   │   ├── SetlistPickerDrawer.tsx # 셋리스트 선택 모드 드로어
│   │   ├── Drawer.tsx              # 공통 드로어(바텀시트)
│   │   ├── BottomNavbar.tsx        # 하단 탭 네비게이션
│   │   ├── StickyHeader.tsx        # 스크롤 시 고정 헤더
│   │   ├── HeroSection.tsx         # 페이지 상단 로고·타이틀 영역
│   │   ├── SongCard.tsx            # 검색 결과 곡 카드
│   │   ├── SavedSongCard.tsx       # 저장된 애창곡 카드
│   │   ├── TagChip.tsx             # 태그 칩
│   │   └── EmptySongs.tsx          # 곡이 없을 때 안내 화면
│   ├── pages/                 # 탭별 페이지
│   │   ├── MySongs.tsx             # 나의 애창곡
│   │   ├── SongSearch.tsx          # 노래방 검색
│   │   ├── NewSongs.tsx            # 이번 주 신곡
│   │   └── Setlist.tsx             # 셋리스트
│   ├── store/                 # Zustand 스토어 (localStorage 저장)
│   │   ├── useSongStore.ts         # 애창곡 상태
│   │   ├── useSetlistStore.ts      # 셋리스트 상태
│   │   └── useTagStore.ts          # 태그 상태
│   ├── hooks/                 # 커스텀 훅
│   │   ├── useSongActions.ts       # 검색 → 애창곡 추가 로직
│   │   └── useTagSelection.ts      # 태그 선택·토글 로직
│   ├── type/                  # 타입 정의
│   │   ├── songs.ts                # Song 타입
│   │   ├── tags.ts                 # Tag 타입 · 기본 태그
│   │   └── api.ts                  # 노래방 API 응답 타입
│   ├── App.tsx                # 탭 기반 페이지 라우팅
│   ├── main.tsx               # 엔트리 포인트
│   └── index.css             # 전역 스타일 · 컬러 토큰
├── index.html
├── vite.config.ts
└── package.json
```

<br/>

## 🚀 시작하기

### 요구 사항

- Node.js 18 이상
- npm

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd en.core

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 프로덕션 빌드
npm run build

# 5. 빌드 결과 미리보기
npm run preview
```

개발 서버 실행 후 터미널에 표시되는 주소(기본 `http://localhost:5173`)로 접속하면 됩니다.

<br/>

## 📸 스크린샷

### ❤️ 애창곡

곡 제목, 가수, TJ/금영 번호, 키(key), 태그를 기록하고 수정/삭제가 가능합니다.
<br />

|                                                           애창곡 빈 화면                                                            |                                                             애창곡 출력                                                             |
| :---------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
| <img width="585" height="1266" alt="Image" src="https://github.com/user-attachments/assets/86c6ac66-680b-40bc-8103-feb9f2cfe83d" /> | <img width="585" height="1266" alt="Image" src="https://github.com/user-attachments/assets/cfd7a92b-5431-46f8-8801-1d205e21ef61" /> |

<br/>
<br />

### 🔍 곡 검색

TJ/금영 노래방 API로 곡 제목·가수를 검색하고 이번 주 신곡 확인, 애창곡으로 바로 저장이 가능합니다
<br /><br />
<img width="454" height="670" alt="Image" src="https://github.com/user-attachments/assets/7e7f0759-ced8-45a3-ab89-01ca35cd1f72" />

<br /> 
<br />

### 🎲 셋리스트

태그로 필터링해 랜덤으로 뽑거나, 직접 골라 오늘의 셋리스트를 구성합니다.

<br/>

|                                                           셋리스트(랜덤)                                                           |                                                           셋리스트(선택)                                                           |
| :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
| <img width="454" height="670" alt="Image" src="https://github.com/user-attachments/assets/ac334d2b-4c84-4bb2-a0cf-8c61b10422ef" /> | <img width="454" height="670" alt="Image" src="https://github.com/user-attachments/assets/0136df4a-f57c-4ec4-a66f-2fc2cdae48c5" /> |

<br/>
<br />

## 🔮 향후 추가 계획

- 🧾 **오늘의 노래 정산 영수증** — 오늘 부른 노래(셋리스트)들을 영수증 모양의 이미지로 정산, 공유할 수 있는 기능
- 🏷️ **커스텀 태그 UI** — 사용자 정의 태그 추가/삭제 화면 (스토어 로직은 구현 완료)
- 🎚️ **애창곡 내 검색, 필터 구현** — 곡 제목·가수로 검색하고, 태그별로 조회하는 기능
- ☁️ **데이터 백업/동기화** — JSON 파일로 백업하고 내보내기/가져오기

<br/>

---

🎶 _오늘의 셋리스트는? 앵콜과 함께 준비해보세요._
