# Reddy 🔴 — 취준 생산성 대시보드

## 시작 방법 (3단계)

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.local.example .env.local
```
`.env.local` 열어서 Supabase URL과 anon key 입력
(Supabase 대시보드 → Project Settings → API)

### 3. Supabase DB 세팅
Supabase 대시보드 → SQL Editor → `supabase_schema.sql` 내용 붙여넣고 Run

### 4. 실행
```bash
npm run dev
```
→ http://localhost:3000

---

## Vercel 배포
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_ID/reddy.git
git push -u origin main
```
vercel.com → New Project → 저장소 선택 → 환경변수 입력 → Deploy
