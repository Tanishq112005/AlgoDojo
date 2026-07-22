
FROM node:20


RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg \
    libxshmfence-dev \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgtk-3-0 \
    libdrm2 \
    xdg-utils \
    --no-install-recommends && \

    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
  
    rm google-chrome-stable_current_amd64.deb && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .

RUN chmod +x /app/node_modules/.bin/tsc

RUN npm run build

USER node

EXPOSE 8000


CMD [ "npm", "start" ]