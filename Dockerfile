# specify the node base image with your desired version node:<version>
FROM node:8

RUN useradd --user-group --create-home --shell /bin/false nodejs

ENV HOME=/home/nodejs
ENV NODE_ENV=production

COPY package.json yarn.lock $HOME/app/
RUN chown -R nodejs:nodejs $HOME/*
USER nodejs
WORKDIR $HOME/app
RUN yarn install

CMD ["node", "app.js"]

# replace this with your application's default port
# EXPOSE 10010

