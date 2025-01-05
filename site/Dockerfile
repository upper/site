FROM node:current-alpine3.14 AS builder

WORKDIR /app
COPY . /app

RUN yarn install && \
	yarn build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
