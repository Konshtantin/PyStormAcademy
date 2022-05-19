FROM alpine:3.14

WORKDIR /app/

RUN apk --no-cache add nodejs-current

RUN apk add --update nodejs-current npm

RUN apk --no-cache add python3

RUN apk --no-cache add py3-requests

COPY package.json ./

RUN npm install

COPY . ./

ENV HTTPPORT 80

ENV HTTPSPORT 443

ENV MONGO_URI mongodb+srv://<name>:<password>@<db_url>?retryWrites=true&w=majority

ENV SESSION_KEY <put_secret_key_here>

ENV CONFIRM_KEY <put_secret_key_here>

ENV CHANGE_KEY <put_secret_key_here>

CMD [ "node", "app.js" ]