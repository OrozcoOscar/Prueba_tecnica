FROM node:20-alpine AS base
WORKDIR /app
COPY package.json tsconfig.json .eslintrc.cjs .prettierrc ./
COPY prisma ./prisma
RUN npm install
COPY src ./src
RUN npx prisma generate
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/server.js"]
