.DEFAULT_GOAL := default

lambda_path = ./modules/lambda/lambda_function
zip_name = pre_sign_up.zip

default: apply

lambda-clean:
	rm -f $(lambda_path)/$(zip_name)

lambda-zip:
	cd $(lambda_path) && zip -r $(zip_name) index.py src

init:
	terraform init

apply: init lambda-clean lambda-zip
	terraform apply

clean: 
	terraform destroy 

.PHONY: lambda-clean lambda-zip apply destroy init