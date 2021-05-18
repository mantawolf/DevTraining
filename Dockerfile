FROM golang:1.16

WORKDIR /src
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

CMD ["app"]