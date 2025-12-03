# GitHub Pages 배포 가이드

## 1단계: 새 저장소 생성

1. GitHub 대시보드에서 우측 상단의 **"+"** 클릭 → **"New repository"** 선택
2. 저장소 설정:
   - **Repository name**: `jinwoo-smc-aml` (원하는 이름)
   - **Public** 선택 (Private는 유료)
   - "Add a README file" 체크 해제
   - **"Create repository"** 클릭

## 2단계: 파일 업로드

### 방법 A: 웹에서 직접 업로드 (가장 간단)

1. 저장소 페이지에서 **"uploading an existing file"** 클릭
2. `index.html` 파일을 드래그 앤 드롭
3. 하단 **"Commit changes"** 클릭

### 방법 B: Git 명령어 사용 (터미널)

프로젝트 폴더에서 다음 명령어 실행:

```bash
# Git 초기화 (처음 한 번만)
git init

# 파일 추가
git add index.html

# 커밋
git commit -m "Initial commit: Add password generator"

# GitHub 저장소 연결 (저장소 URL은 본인의 것으로 변경)
git remote add origin https://github.com/[사용자명]/jinwoo-smc-aml.git

# 파일 업로드
git branch -M main
git push -u origin main
```

## 3단계: GitHub Pages 활성화

1. 저장소 페이지에서 **"Settings"** 탭 클릭
2. 왼쪽 메뉴에서 **"Pages"** 클릭
3. **"Source"** 섹션에서:
   - **"Deploy from a branch"** 선택
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 선택
   - **"Save"** 클릭

## 4단계: 배포 확인

1. 몇 분 후 (1-2분) 저장소 페이지로 돌아가기
2. **"Settings"** → **"Pages"**에서 배포된 URL 확인
3. URL 형식: `https://[사용자명].github.io/jinwoo-smc-aml/`
4. 해당 URL을 브라우저에서 열어 확인

## 5단계: 휴대폰에서 접속

- 배포된 URL을 휴대폰 브라우저에서 열기
- 또는 URL을 북마크에 저장하여 쉽게 접근

## 주의사항

- 파일을 수정한 후에는 다시 커밋하고 푸시해야 반영됩니다
- 배포에는 보통 1-2분 정도 소요됩니다
- Public 저장소는 누구나 코드를 볼 수 있습니다

## 파일 업데이트 방법

### 웹에서:
1. 저장소에서 `index.html` 파일 클릭
2. 연필 아이콘(✏️) 클릭하여 편집
3. 내용 수정 후 **"Commit changes"** 클릭

### Git 명령어로:
```bash
git add index.html
git commit -m "Update password generator"
git push
```

