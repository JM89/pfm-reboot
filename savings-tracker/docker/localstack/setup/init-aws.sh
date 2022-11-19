#!/bin/sh

# shellcheck disable=SC2164
cd "/etc/localstack/init/ready.d/terraform"

terraform init
terraform plan -out plan
terraform apply plan