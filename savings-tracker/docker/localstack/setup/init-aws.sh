#!/bin/sh

# shellcheck disable=SC2164
cd "/etc/localstack/init/ready.d/terraform"

echo "terraform init"
terraform init

echo "terraform plan -var-file="./envs/$TERRAFORM_ENVIRONMENT.tfvars" -out plan"
terraform plan -var-file="./envs/$TERRAFORM_ENVIRONMENT.tfvars" -out plan

echo "terraform apply plan"
terraform apply plan