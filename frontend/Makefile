.DEFAULT_GOAL := default

BUCKET_NAME := reactjs-login-bucket

clean-bucket:
	aws s3 rm s3://${BUCKET_NAME} --recursive

clean-build:
	@if [ -d "build" ]; then rm -r build; fi

clean: clean-build clean-bucket

build: 
	npm run build

deploy: clean build 
	aws s3 cp build/ s3://${BUCKET_NAME}/ --recursive

.PHONY: clean-bucket build deploy clean-build clean