FROM node:14.3.0-alpine3.11

ENV HOME=/app/frontend
ENV REACT_APP_API_URL=http://localhost:8000


# RUN addgroup -S frontend && adduser -S frontend -G frontend

WORKDIR $HOME
# I dont think I need to copy beacause of volumes
# COPY package*.json ./
# RUN npm install
# COPY src ./src

# RUN chown -R frontend:frontend $HOME
# USER frontend

CMD [ "npm", "start"]


