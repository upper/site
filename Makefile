GIT_SHORTHASH       := $(shell git rev-parse --short HEAD)
DOCKER_IMAGE_TAG    := $(GIT_SHORTHASH)

VIRTUAL_ENV         ?= ./.venv

export VIRTUAL_ENV

export DOCKER_IMAGE_TAG

docker-build: \
	docker-build-site \
	docker-build-vanity \
	docker-build-playground-executor \
	docker-build-tour

docker-push: \
	docker-push-site \
	docker-push-vanity \
	docker-push-playground-executor \
	docker-push-tour

docker-build-%:
	docker build -t "upper/${*}:${DOCKER_IMAGE_TAG}" -f "${*}/Dockerfile" "${*}/"

docker-push-%: docker-build-%
	docker tag "upper/${*}:${DOCKER_IMAGE_TAG}" "upper/${*}:latest"
	docker push "upper/${*}:${DOCKER_IMAGE_TAG}" && \
	docker push "upper/${*}:latest"

deploy-%:
	ansible-playbook \
		-i "./inventory/${*}.yml" \
		-v playbook.yml

deploy: \
	deploy-local

yamlfmt:
	find . -name \*.yml | grep -v node_modules | xargs yamlfmt
