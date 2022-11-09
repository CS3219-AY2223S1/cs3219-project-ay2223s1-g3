FROM node:16

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]