FROM node:16

WORKDIR /usr/src/questions

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

CMD [ "npm", "start" ]