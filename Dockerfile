FROM node:lts
COPY . .

RUN npm i
ENTRYPOINT ["compose/entrypoint"]