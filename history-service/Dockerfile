FROM node:16

WORKDIR /usr/src/history

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8003

CMD [ "npm", "start" ]