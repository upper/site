FROM xiam/go-playground:latest

RUN apk update

RUN apk add --no-cache \
		bash \
    curl \
    gcc \
    git \
    htop \
    iftop \
    iptables \
    net-tools \
    netcat-openbsd \
    shadow

ENV GOROOT=/usr/local/go

ENV WORKDIR=/home/playground

RUN useradd -u 1000 -ms /bin/sh playground && \
  usermod -aG playground playground

COPY entrypoint.sh /bin/entrypoint.sh
RUN chmod +x /bin/entrypoint.sh

WORKDIR ${WORKDIR}

# use canary build as base for the playground
COPY canary ./playground

RUN cd ./playground && \
  go get -u ./... && \
  go mod tidy && \
  go mod vendor -o vendor && \
  go build -v -o /dev/null && \
  rm -f main.go

EXPOSE 3000
EXPOSE 3003

ENTRYPOINT ["/bin/entrypoint.sh"]
