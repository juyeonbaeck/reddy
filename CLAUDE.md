# Reddy 프로젝트

## 실행 명령어
- `npm run dev` — 로컬 서버 시작 (localhost:3000)
- `npm run build` — 프로덕션 빌드
- `git push` — Vercel 자동 배포

## 기술 스택
- Next.js 14 App Router
- Supabase (PostgreSQL + Auth)
- Tailwind CSS
- TypeScript

## 폴더 구조
- `app/(dashboard)/` — 메인 페이지들 (사이드바 포함)
- `app/login/` — 로그인 페이지 (사이드바 없음)
- `components/` — 공통 컴포넌트
- `hooks/useTasks.ts` — Supabase 실시간 연동
- `lib/supabase.ts` — Supabase 클라이언트 + Task 타입

## 컬러 테마
- Primary: reddy-500 (#6D1325, Burgundy)
- 카테고리: Study=reddy, JobApp=blue, Personal=green