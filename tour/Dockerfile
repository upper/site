FROM golang:1.23.3 AS builder

WORKDIR /go/src/github.com/upper/site/tour

COPY ./ ./

RUN go install github.com/upper/site/tour/cmd/tour

FROM alpine:3.20.3

WORKDIR /app

RUN mkdir ./bin

COPY --from=builder /go/bin/tour /app/bin/tour

COPY --from=builder /go/src/github.com/upper/site/tour/static /app/static
COPY --from=builder /go/src/github.com/upper/site/tour/tutorials /app/tutorials

EXPOSE 4000

CMD ["/app/bin/tour"]
