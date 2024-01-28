FROM node:lts-alpine3.19
RUN mkdir app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . .
EXPOSE 8080
EXPOSE 3306
CMD ["npm", "start"]
