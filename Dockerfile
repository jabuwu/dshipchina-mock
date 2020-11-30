FROM node:14
WORKDIR /usr/src/dshipchina
COPY package*.json ./
RUN npm install
COPY tsconfig.json .
COPY webpack.config.js .
COPY src/ ./src/
COPY frontend/ ./frontend/
RUN npm run build
ENV DATA_DIR=/data
CMD [ "node", "dist/index.js" ]