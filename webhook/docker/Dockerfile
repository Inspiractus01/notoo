FROM alpine:latest

RUN apk add --no-cache bash curl git wget && \
    wget -O /usr/local/bin/webhook https://github.com/adnanh/webhook/releases/download/2.8.1/webhook-linux-arm && \
    chmod +x /usr/local/bin/webhook

ENTRYPOINT ["webhook"]