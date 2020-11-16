FROM navikt/node-express:14-alpine

WORKDIR /workdir
COPY src ./src
COPY package.json package-lock.json ./

RUN npm ci
ENV NODE_ENV production
RUN npm prune

CMD ["node", "./src/app.js"]