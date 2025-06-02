# Node.js LTS 기반 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY moDohae/package*.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 복사
COPY moDohae .

# 포트 오픈 (예: 3000 사용 시)
EXPOSE 3000

# 앱 실행
CMD ["node", "app.js"]

