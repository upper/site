GIT_SHORTHASH			  := $(shell git rev-parse --short HEAD)
DOCKER_IMAGE_TAG    := $(GIT_SHORTHASH)

PYTHON_BIN          ?= $(shell which python3)

VIRTUAL_ENV         ?= ./.venv

DEPLOY_ENV          ?= local

export DEPLOY_ENV

export DOCKER_IMAGE_TAG

deploy:
	ansible-playbook \
		-i ./inventory \
		-e "env=${DEPLOY_ENV}" \
		-v playbook.yml

docker-build-%:
	docker build -t upper/$*:${DOCKER_IMAGE_TAG} -f $*/Dockerfile $*/

docker-push-%: docker-build-%
	docker tag upper/$*:${DOCKER_IMAGE_TAG} upper/$*:latest
	docker push upper/$*:${DOCKER_IMAGE_TAG} && \
	docker push upper/$*:latest

docker-build: docker-build-site docker-build-vanity docker-build-playground-executor docker-build-tour
