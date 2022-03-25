
.PHONY: docker-build docker-shell print-build-args \
        default build \
        print-docker-hub-image kill \
        clean

#####
# user-facing variables

# override this with e.g.
#     make BUILD_ENVIRONMENT=production build
# or
#     make BUILD_ENVIRONMENT=gh-pages build
# as needed.
#
# recognized values are:
# - development
# - production
# - gh-pages
#
# The eleventy config file will set base URL as
# appropriate.
BUILD_ENVIRONMENT=development


#####

SHELL=bash

# docker bits

IMAGE_NAME=dsa-website

IMAGE_VERSION=0.1.0

print-image-name:
	@echo $(IMAGE_NAME)

print-image-version:
	@echo $(IMAGE_VERSION)

# eleventy

IMG=$(IMAGE_NAME):$(IMAGE_VERSION)
PACKAGE_DIR=/opt/site
ELEVENTY_JS_FILE=/src/.eleventy.js
IN_DIR = $$PWD/src
ASSETS_DIR = $$PWD/assets
OUT_DIR = $$PWD/out
# uncomment this to debug eleventy:
#DEBUG_FLAGS=DEBUG='*'
# change this to 'development' to use that environment
# for the build
ENVIRO_FLAGS=ELEVENTY_ENV=$(BUILD_ENVIRONMENT)
CTR_NAME=eleventy


DOCKER = docker -D

docker_args = \
	    -v $(IN_DIR):/src \
	    -v $(ASSETS_DIR):/assets \
	    -v $(OUT_DIR):/out \
	    $(MOUNT_PACKAGE) \
	    --name $(CTR_NAME) \
	    --workdir $(PACKAGE_DIR) \
	    --entrypoint sh

docker-build:
	docker build -f Dockerfile -t $(IMG) .

# real kill target
kill_:
	-$(DOCKER) stop -t 1 $(CTR_NAME) 2>/dev/null
	-$(DOCKER) rm $(CTR_NAME) 2>/dev/null

# silent wrapper of kill_
kill:
	make kill_ 2>/dev/null>/dev/null

ifeq ($(BUILD_ENVIRONMENT),gh-pages)
pullfirst = -$(DOCKER) pull $(IMG)
endif


# quick-and-dirty serve, for local use
# We use the dev environment
serve: kill
	$(DOCKER) run --rm -it \
	    $(docker_args) \
	    -p 8080:8080 \
	    $(IMG) \
	    -c "$(DEBUG_FLAGS) ELEVENTY_ENV=development eleventy.sh $(PACKAGE_DIR) $(ELEVENTY_JS_FILE) --serve"


# build static site
build: kill
	$(pullfirst)
	$(DOCKER) run --pull --rm \
	    $(docker_args) \
	    $(IMG) \
	    -c "$(DEBUG_FLAGS) $(ENVIRO_FLAGS) eleventy.sh $(PACKAGE_DIR) $(ELEVENTY_JS_FILE)"

docker-shell: kill
	$(pullfirst)
	set -x && $(DOCKER) run --pull --rm -it \
	    $(docker_args) \
	    -p 8080:8080 \
	    $(IMG)

deploy-to-csse: clean site-build
	read -p "Do you wish to continue with deploy? (y/n)" yn && \
		if [ $$yn != y ]; then exit 1; fi
	rsync --progress -P -rlvptz \
		--bwlimit=90K out/_site/ teaching:DSA-SWU/WWW/

mount:
	sshfs teaching:DSA-SWU/WWW ~/mounts/teaching

meld:
	meld out/_site ~/mounts/teaching

clean:
	sudo rm -rf out/_site

