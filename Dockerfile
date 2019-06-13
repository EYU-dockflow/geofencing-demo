FROM alpine:3.9
WORKDIR /app

COPY ./package-lock.json package-lock.json
COPY ./package.json package.json

RUN apk add nodejs nodejs-npm
RUN npm install
RUN npm install -g typescript

COPY . ./

RUN cd ./ && tsc

EXPOSE 3000
ENTRYPOINT [ "node", "dist/app.js" ]