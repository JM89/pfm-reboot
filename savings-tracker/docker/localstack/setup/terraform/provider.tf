provider "aws" {
  access_key = "XXX"
  secret_key = "XXX"
  region     = "eu-west-2"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    kms = "http://localhost:4566"
    ssm = "http://localhost:4566"
  }
}