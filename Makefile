GIT_SHORTHASH       := $(shell git rev-parse --short HEAD)

DOCKER_IMAGE_TAG    := $(GIT_SHORTHASH)

PYTHON_BIN          ?= $(shell which python3)

VIRTUAL_ENV         ?= ./.venv

export DOCKER_IMAGE_TAG

docker-build-%:
	docker build -t upper/$*:${DOCKER_IMAGE_TAG} -f $*/Dockerfile $*/

docker-push-%: docker-build-%
	docker tag upper/$*:${DOCKER_IMAGE_TAG} upper/$*:latest
	docker push upper/$*:${DOCKER_IMAGE_TAG} && \
	docker push upper/$*:latest

deploy-%:
	ansible-playbook \
		-i ./inventory \
		-l "$*" \
		-v playbook.yml

docker-build: docker-build-site docker-build-vanity docker-build-playground-executor docker-build-tour

docker-push: docker-push-site docker-push-vanity docker-push-playground-executor docker-push-tour

deploy: deploy-local
