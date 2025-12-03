# Supabase 설정 가이드

## 1단계: Supabase 프로젝트 정보 확인

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택: `junho` → `pa-wd`
3. 프로젝트 설정 → API 메뉴로 이동
4. 다음 정보를 복사하세요:
   - **Project URL**: `https://xxxxx.supabase.co` 형식
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 형식

## 2단계: 데이터베이스 테이블 생성

1. Supabase 대시보드에서 **SQL Editor** 메뉴 클릭
2. `supabase_schema.sql` 파일의 내용을 복사하여 실행
3. 또는 다음 SQL을 직접 실행:

```sql
-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 정책 생성: 모든 사용자가 읽기 가능
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- 정책 생성: 모든 사용자가 사용자 생성 가능 (필요시 수정)
CREATE POLICY "Anyone can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- 정책 생성: 관리자만 사용자 삭제 가능
CREATE POLICY "Only admins can delete users" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE username = current_setting('app.current_user', true)::text 
            AND is_admin = true
        )
    );

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

## 3단계: index.html 파일 설정

1. `index.html` 파일을 열기
2. 다음 부분을 찾아서 실제 값으로 변경:

```javascript
// Supabase 초기화
const SUPABASE_URL = 'https://[YOUR_PROJECT_ID].supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

3. 실제 값으로 변경:
   - `SUPABASE_URL`: 1단계에서 복사한 Project URL
   - `SUPABASE_ANON_KEY`: 1단계에서 복사한 anon public key

예시:
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

## 4단계: 초기 관리자 계정 생성

1. Supabase 대시보드 → **Table Editor** → `users` 테이블 클릭
2. **Insert row** 클릭
3. 다음 값 입력:
   - `username`: 원하는 관리자 사용자명 (예: `admin`)
   - `password_hash`: 관리자 비밀번호 (예: `admin2529`)
   - `is_admin`: `true` 체크
4. **Save** 클릭

## 5단계: 테스트

1. `index.html` 파일을 브라우저에서 열기
2. 로그인 화면에서 관리자 계정으로 로그인
3. 관리자 모드에서 사용자 등록 테스트
4. 일반 사용자로 로그인하여 비밀번호 생성 기능 테스트

## 보안 참고사항

⚠️ **현재 구현은 비밀번호를 평문으로 저장합니다.** 
실제 운영 환경에서는 다음을 권장합니다:

1. **비밀번호 해싱**: bcrypt 또는 Supabase Auth 사용
2. **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS 사용
3. **RLS 정책 강화**: 필요에 따라 Row Level Security 정책 수정

## 문제 해결

### 연결 오류가 발생하는 경우:
- Supabase URL과 API 키가 올바른지 확인
- 브라우저 개발자 도구 콘솔에서 오류 메시지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 사용자 등록이 안 되는 경우:
- RLS 정책 확인
- SQL Editor에서 테이블이 제대로 생성되었는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

