// 설정 파일
// ⚠️ 이 파일은 .gitignore에 추가하여 버전 관리에서 제외하세요!

// Supabase 설정
const CONFIG = {
    // Supabase 프로젝트 URL
    SUPABASE_URL: 'https://hpgibccgftmuihbrxetn.supabase.co',
    
    // Supabase Anon API Key
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ2liY2NnZnRtdWloYnJ4ZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDE2MDIsImV4cCI6MjA4MDMxNzYwMn0.iR85ZLzeHrjjn9cbP9xOuNBX8IR4AO7f5NzHU9vCBqI',
    
    // 관리자 비밀번호
    ADMIN_PASSWORD: 'admin2529'
};

// 설정 값 검증
if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
    console.error('⚠️ Supabase URL이 설정되지 않았습니다.');
}

if (!CONFIG.SUPABASE_ANON_KEY || CONFIG.SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')) {
    console.error('⚠️ Supabase API Key가 설정되지 않았습니다.');
}

if (!CONFIG.ADMIN_PASSWORD) {
    console.error('⚠️ 관리자 비밀번호가 설정되지 않았습니다.');
}

