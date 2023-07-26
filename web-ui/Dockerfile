FROM node:15

WORKDIR /home/node/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src/components ./src/components
COPY ./src/mixins ./src/mixins
COPY ./src/pages ./src/pages
COPY ./src/theme ./src/theme
COPY ./src/*.js ./src/
COPY ./public ./public/
COPY ./src/config/docker.json ./src/config/default.json 
COPY ./jsconfig.json ./jsconfig.json 

RUN chmod u+x -R ./src
RUN chmod u+x -R ./public

EXPOSE 3000

CMD [ "npm", "run", "start" ]