FROM node:20-alpine

ENV SHELL /bin/sh

RUN echo "Current shell version:"
RUN $SHELL --version

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

RUN pnpm install serve

EXPOSE 3000

CMD ["pnpm", "start"]
