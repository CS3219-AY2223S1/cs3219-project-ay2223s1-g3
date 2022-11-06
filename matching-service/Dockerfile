FROM node:16

WORKDIR /usr/src/matching

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

CMD [ "npm", "start" ]