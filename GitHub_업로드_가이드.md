# GitHub 업로드 가이드

## ✅ 업로드해야 할 파일

### 필수 파일
1. **`index.html`** - 메인 애플리케이션 파일
2. **`config.example.js`** - 설정 예제 파일 (실제 키 없음)
3. **`supabase_schema.sql`** - 데이터베이스 스키마 파일
4. **`.gitignore`** - 보안 파일 제외 설정

### 문서 파일 (선택사항)
5. **`README_배포방법.md`** - 배포 방법 가이드
6. **`GitHub_배포_가이드.md`** - GitHub Pages 배포 가이드
7. **`SUPABASE_설정가이드.md`** - Supabase 설정 가이드
8. **`GitHub_업로드_가이드.md`** - 이 파일

## ❌ 업로드하면 안 되는 파일

1. **`config.js`** - 실제 API 키와 비밀번호가 들어있음 (보안상 중요!)
   - 이미 `.gitignore`에 포함되어 있어 자동으로 제외됩니다

2. **`.hwpx` 파일들** - 한글 파일 (필요 없음)
   - `기터브배포방법.hwpx`
   - `비번프로그램.hwpx`

3. **`supabase_config.js`** - 사용하지 않는 예제 파일 (선택사항)

## 📋 업로드 체크리스트

### 방법 1: 웹에서 직접 업로드
1. GitHub 저장소 페이지에서 "Add file" → "Upload files"
2. 다음 파일들을 드래그 앤 드롭:
   - ✅ `index.html`
   - ✅ `config.example.js`
   - ✅ `supabase_schema.sql`
   - ✅ `.gitignore`
   - ✅ `README_배포방법.md` (선택)
   - ✅ `GitHub_배포_가이드.md` (선택)
   - ✅ `SUPABASE_설정가이드.md` (선택)

### 방법 2: Git 명령어 사용
```bash
# 파일 추가
git add index.html
git add config.example.js
git add supabase_schema.sql
git add .gitignore
git add README_배포방법.md
git add GitHub_배포_가이드.md
git add SUPABASE_설정가이드.md

# 커밋
git commit -m "Initial commit: Password generator with Supabase"

# 업로드
git push origin main
```

## ⚠️ 중요 확인사항

1. **`config.js`는 절대 업로드하지 마세요!**
   - `.gitignore`에 포함되어 있지만, 다시 한 번 확인하세요
   - GitHub에 업로드되면 API 키가 노출됩니다

2. **다른 사람이 사용하려면:**
   - `config.example.js`를 복사하여 `config.js`로 만들고
   - 실제 Supabase URL과 API 키를 입력해야 합니다

3. **README 파일 생성 권장:**
   - `README.md` 파일을 만들어서 설정 방법을 설명하면 좋습니다

