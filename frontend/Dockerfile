FROM node:14.3.0-alpine3.11


# RUN addgroup -S frontend && adduser -S frontend -G frontend

WORKDIR /app/frontend
# I dont think I need to copy beacause of volumes
# COPY package*.json ./
# RUN npm install
# COPY src ./src

# RUN chown -R frontend:frontend $HOME
# USER frontend

CMD [ "npm", "start"]


