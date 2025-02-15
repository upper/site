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

ENV GOPATH=/go
ENV GOROOT=/usr/local/go

ENV SRCDIR=./src

ENV PKGDIR=${GOPATH}/src/github.com/upper/db

ENV TAG_V4=v4.9.0

ENV WORKDIR=/home/playground

RUN useradd -ms /bin/sh playground && \
  usermod -aG playground playground

COPY entrypoint.sh /bin/entrypoint.sh
RUN chmod +x /bin/entrypoint.sh

RUN mkdir -p ${PKGDIR}

WORKDIR ${WORKDIR}

COPY _tests ./_tests

RUN cd ./_tests/v4 && \
  go mod init unsafebox-tests/v4 && \
  go mod tidy && \
  go mod edit -replace github.com/upper/db/v4=github.com/upper/db/v4@${TAG_V4} && \
  go mod vendor && \
  go build -v

RUN git clone https://github.com/upper/db.git ${SRCDIR}

RUN cp -r ${SRCDIR} ${PKGDIR}/v4 && \
  cd ${PKGDIR}/v4 && \
  git checkout ${TAG_V4} && \
  go get -v ./...

RUN cd ./_tests/v4 && \
  go build -v

EXPOSE 3000
EXPOSE 3003

ENTRYPOINT ["/bin/entrypoint.sh"]
