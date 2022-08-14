FROM node:16
RUN mkdir /app
COPY package.json /app/
COPY package-lock.json /app/
COPY src /app/src
COPY node_modules /app/node_modules
CMD cd /app && exec npm start
