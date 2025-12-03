-- Supabase 데이터베이스 스키마
-- Supabase 대시보드에서 SQL Editor로 실행하세요

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

-- 정책 생성: 모든 사용자가 읽기 가능 (필요에 따라 수정)
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- 정책 생성: 모든 사용자가 사용자 생성 가능 (필요시 수정)
CREATE POLICY "Anyone can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- 정책 생성: 모든 사용자가 사용자 삭제 가능 (필요시 관리자만 가능하도록 수정)
-- 주의: 실제 운영 환경에서는 관리자만 삭제 가능하도록 수정하세요
CREATE POLICY "Anyone can delete users" ON users
    FOR DELETE USING (true);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

