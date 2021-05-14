FROM node:15

WORKDIR /home/node/app

COPY ./package.json ./
RUN npm install

COPY . ./

EXPOSE 3000

CMD [ "npm", "start" ]