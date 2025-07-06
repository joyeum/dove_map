#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Web 보일러플레이트 자동 설정${NC}"
echo "=================================="

# 개발자명 고정
AUTHOR_NAME="Doy"

# 정보 입력받기
if [ -z "$1" ]; then
    echo -e "${YELLOW}1단계: 서비스명을 입력하세요${NC}"
    read -p "> " SERVICE_NAME
    
    if [ -z "$SERVICE_NAME" ]; then
        echo -e "${RED}❌ 서비스명이 필요합니다.${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${YELLOW}2단계: 서비스 설명을 입력하세요 (예: 혁신적인 웹 서비스)${NC}"
    read -p "> " SERVICE_DESC
    
    if [ -z "$SERVICE_DESC" ]; then
        SERVICE_DESC="혁신적인 웹 서비스"
    fi
else
    SERVICE_NAME="$1"
    SERVICE_DESC="${2:-혁신적인 웹 서비스}"
fi

if [ -z "$SERVICE_NAME" ]; then
    echo -e "${RED}❌ 서비스명이 필요합니다.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}📝 서비스명: ${SERVICE_NAME}${NC}"
echo -e "${GREEN}📝 설명: ${SERVICE_DESC}${NC}"
echo -e "${GREEN}📝 개발자: ${AUTHOR_NAME}${NC}"
echo ""

# 1. package.json 업데이트
echo -e "${BLUE}1. package.json 업데이트 중...${NC}"
# 소문자로 변환하고 공백을 하이픈으로 변경
PACKAGE_NAME=$(echo "$SERVICE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')

# package.json에서 name, description, author 변경
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"name\": \".*\"/\"name\": \"$PACKAGE_NAME\"/" package.json
    sed -i '' "s/\"description\": \".*\"/\"description\": \"$SERVICE_DESC\"/" package.json
    sed -i '' "s/\"author\": \".*\"/\"author\": \"$AUTHOR_NAME\"/" package.json
else
    # Linux
    sed -i "s/\"name\": \".*\"/\"name\": \"$PACKAGE_NAME\"/" package.json
    sed -i "s/\"description\": \".*\"/\"description\": \"$SERVICE_DESC\"/" package.json
    sed -i "s/\"author\": \".*\"/\"author\": \"$AUTHOR_NAME\"/" package.json
fi

# 2. index.html 업데이트
echo -e "${BLUE}2. index.html 업데이트 중...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/<title>.*<\/title>/<title>$SERVICE_NAME<\/title>/" index.html
    sed -i '' "s/content=\"서비스에 대한 명확한 설명 (150자 이내)\"/content=\"$SERVICE_DESC\"/" index.html
    sed -i '' "s/content=\"서비스명 - 간단한 설명\"/content=\"$SERVICE_NAME\"/" index.html
    sed -i '' "s/content=\"서비스에 대한 명확한 설명\"/content=\"$SERVICE_DESC\"/" index.html
    sed -i '' "s/content=\"회사명 또는 개발자명\"/content=\"$AUTHOR_NAME\"/" index.html
else
    # Linux
    sed -i "s/<title>.*<\/title>/<title>$SERVICE_NAME<\/title>/" index.html
    sed -i "s/content=\"서비스에 대한 명확한 설명 (150자 이내)\"/content=\"$SERVICE_DESC\"/" index.html
    sed -i "s/content=\"서비스명 - 간단한 설명\"/content=\"$SERVICE_NAME\"/" index.html
    sed -i "s/content=\"서비스에 대한 명확한 설명\"/content=\"$SERVICE_DESC\"/" index.html
    sed -i "s/content=\"회사명 또는 개발자명\"/content=\"$AUTHOR_NAME\"/" index.html
fi

# 3. 환경변수 파일 생성
echo -e "${BLUE}3. 환경변수 파일 생성 중...${NC}"
cp env.example .env
echo -e "${GREEN}✅ .env 파일 생성 완료${NC}"

# 4. 의존성 설치
echo -e "${BLUE}4. 의존성 설치 중...${NC}"
npm install

# 5. Vercel Analytics 설치
echo -e "${BLUE}5. Vercel Analytics 설치 중...${NC}"
npm install @vercel/analytics

# 6. Git 초기화 및 GitHub 업로드
echo ""
echo -e "${YELLOW}Git 저장소를 새로 초기화하고 GitHub에 업로드하시겠습니까? (y/n):${NC}"
read -p "> " INIT_GIT

if [[ $INIT_GIT =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}5. Git 초기화 중...${NC}"
    rm -rf .git
    git init
    git add .
    git commit -m "🚀 Initial commit: $SERVICE_NAME 프로젝트 생성

- React + Vite + Tailwind CSS 보일러플레이트
- 삼쩜삼 WebView Bridge 연동 준비
- Google Analytics 설정
- SEO 최적화 완료
- 개발 환경 구성 완료"
    
    echo -e "${GREEN}✅ Git 초기화 완료${NC}"
    
    # GitHub 저장소 업로드
    echo ""
    echo -e "${YELLOW}GitHub 저장소에 업로드하시겠습니까? (y/n):${NC}"
    read -p "> " UPLOAD_GITHUB
    
    if [[ $UPLOAD_GITHUB =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${BLUE}GitHub 저장소 URL을 입력하세요:${NC}"
        echo -e "${YELLOW}예시: git@github.com:username/repository.git${NC}"
        echo -e "${YELLOW}또는: https://github.com/username/repository.git${NC}"
        read -p "> " REPO_URL
        
        if [ -z "$REPO_URL" ]; then
            echo -e "${RED}❌ 저장소 URL이 필요합니다.${NC}"
        else
            echo -e "${BLUE}7. GitHub에 업로드 중...${NC}"
            
            # remote origin 설정
            git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
            
            # main 브랜치로 푸시
            git push -u origin main
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}🎉 GitHub 업로드 완료!${NC}"
                echo -e "${BLUE}저장소 주소:${NC} $REPO_URL"
            else
                echo -e "${RED}❌ GitHub 업로드 실패${NC}"
                echo -e "${YELLOW}다음을 확인해주세요:${NC}"
                echo "1. 저장소 URL이 올바른지 확인"
                echo "2. GitHub에 저장소가 생성되어 있는지 확인"
                echo "3. SSH 키 또는 HTTPS 인증이 설정되어 있는지 확인"
                echo ""
                echo -e "${YELLOW}수동으로 업로드하려면:${NC}"
                echo "git remote add origin $REPO_URL"
                echo "git push -u origin main"
            fi
        fi
    fi
fi

echo ""
echo -e "${GREEN}🎉 설정 완료!${NC}"
echo "=================================="
echo -e "${BLUE}서비스명:${NC} $SERVICE_NAME"
echo -e "${BLUE}설명:${NC} $SERVICE_DESC"
echo -e "${BLUE}개발자:${NC} $AUTHOR_NAME"
echo -e "${BLUE}패키지명:${NC} $PACKAGE_NAME"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. 필요하면 .env 파일에서 API 키 설정"
echo "2. npm run dev 로 개발 시작"
echo ""
echo -e "${GREEN}개발 시작: npm run dev${NC}" 