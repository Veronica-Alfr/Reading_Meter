FROM node:latest

WORKDIR /app-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "prisma:generate"]