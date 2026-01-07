# 1️⃣ Base image
FROM node:20

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files first (better caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the app
COPY . .

# 6️⃣ Expose Next.js dev port
EXPOSE 3000

# 7️⃣ Start Next.js in dev mode
CMD ["npm", "run", "dev"]

