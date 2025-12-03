-- ============================================
-- Supabase 데이터베이스 스키마
-- Supabase 대시보드 → SQL Editor에서 실행하세요
-- ============================================

-- 1. 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can delete users" ON users;

-- 4. 정책 생성: 모든 사용자가 읽기 가능
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- 5. 정책 생성: 모든 사용자가 사용자 생성 가능
CREATE POLICY "Anyone can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- 6. 정책 생성: 모든 사용자가 사용자 삭제 가능
-- 주의: 실제 운영 환경에서는 관리자만 삭제 가능하도록 수정하세요
CREATE POLICY "Anyone can delete users" ON users
    FOR DELETE USING (true);

-- 7. 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 8. 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 트리거 생성 (updated_at 자동 갱신)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 초기 관리자 계정 생성 (선택사항)
-- ============================================
-- 아래 주석을 해제하고 실행하면 초기 관리자 계정이 생성됩니다
/*
INSERT INTO users (username, password_hash, is_admin)
VALUES ('admin', 'admin2529', true)
ON CONFLICT (username) DO NOTHING;
*/

-- ============================================
-- 확인 쿼리
-- ============================================
-- SELECT * FROM users;  -- 사용자 목록 확인
-- SELECT * FROM pg_policies WHERE tablename = 'users';  -- 정책 확인
