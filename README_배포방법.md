# 휴대폰 배포 방법

## 방법 1: 파일 직접 전송 (가장 간단)

1. `index.html` 파일을 휴대폰으로 전송
   - 이메일로 보내기
   - 클라우드 저장소(구글 드라이브, 네이버 클라우드 등)에 업로드 후 다운로드
   - USB 케이블로 직접 복사

2. 휴대폰에서 파일 열기
   - 파일 관리자에서 `index.html` 찾기
   - 브라우저 앱 선택하여 열기

## 방법 2: 로컬 웹 서버 사용 (같은 네트워크)

### Python 사용 (Python이 설치되어 있는 경우)

1. 터미널에서 프로젝트 폴더로 이동
2. 다음 명령어 실행:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # 또는 Python 2
   python -m SimpleHTTPServer 8000
   ```

3. 컴퓨터의 IP 주소 확인:
   - Windows: `ipconfig` 명령어 실행 후 IPv4 주소 확인
   - Mac/Linux: `ifconfig` 또는 `ip addr` 명령어 실행

4. 휴대폰에서 접속:
   - 휴대폰을 같은 Wi-Fi 네트워크에 연결
   - 브라우저에서 `http://[컴퓨터IP주소]:8000` 접속
   - 예: `http://192.168.0.100:8000`

### Node.js 사용 (Node.js가 설치되어 있는 경우)

1. `http-server` 설치:
   ```bash
   npm install -g http-server
   ```

2. 프로젝트 폴더에서 실행:
   ```bash
   http-server -p 8000
   ```

3. 휴대폰에서 접속 (방법 2와 동일)

## 방법 3: 무료 호스팅 서비스 사용 (인터넷에서 접근 가능)

### GitHub Pages (추천)

1. GitHub 계정 생성 및 저장소 생성
2. `index.html` 파일을 저장소에 업로드
3. 저장소 Settings → Pages → Source를 "main" 브랜치로 설정
4. 몇 분 후 `https://[사용자명].github.io/[저장소명]` 주소로 접속 가능

### Netlify

1. [netlify.com](https://www.netlify.com) 접속 및 회원가입
2. "Add new site" → "Deploy manually" 선택
3. `index.html` 파일을 드래그 앤 드롭으로 업로드
4. 자동으로 생성된 URL로 접속 가능

### Vercel

1. [vercel.com](https://www.vercel.com) 접속 및 회원가입
2. "New Project" → 파일 업로드 또는 GitHub 연동
3. 자동으로 배포되고 URL 제공

## 방법 4: PWA로 변환 (앱처럼 사용)

현재 HTML 파일은 이미 모바일 최적화되어 있어서, PWA 기능을 추가하면 홈 화면에 추가하여 앱처럼 사용할 수 있습니다.

### PWA 설정 추가

1. `manifest.json` 파일 생성
2. Service Worker 추가
3. 아이콘 이미지 추가

이 방법은 추가 개발이 필요합니다.

## 추천 방법

- **개인 사용**: 방법 1 (파일 직접 전송) - 가장 간단
- **같은 네트워크에서 여러 기기 사용**: 방법 2 (로컬 웹 서버)
- **인터넷에서 접근 가능하게**: 방법 3 (무료 호스팅)

