FROM alpine:3.14

WORKDIR /app/

RUN apk --no-cache add nodejs-current

RUN apk add --update nodejs-current npm

RUN apk --no-cache add python3

RUN apk --no-cache add py3-requests

COPY package.json ./

RUN npm install

COPY . ./

ENV PORT 3000

CMD [ "node", "app.js" ]