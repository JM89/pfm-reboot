locals {
  default_tags = {
    "env" : var.environment
  }
}

resource "aws_ssm_parameter" "log_agent_host" {
  name  = "/log-agent/host"
  type  = "String"
  value = var.log_agent_host
  tags  = merge(local.default_tags, {
    "group" : "log-agent"
  })
}

resource "aws_ssm_parameter" "log_agent_port" {
  name  = "/log-agent/port"
  type  = "String"
  value = var.log_agent_port
  tags  = merge(local.default_tags, {
    "group" : "log-agent"
  })
}

resource "aws_ssm_parameter" "db_connection_string" {
  name  = "/db/connection_string"
  type  = "String"
  value = var.db_connection_string
  tags  = merge(local.default_tags, {
    "group" : "db"
  })
}

resource "aws_ssm_parameter" "db_connection_string_key" {
  name   = "/db/password"
  type   = "SecureString"
  value  = "TBD"
  key_id = aws_kms_key.ssm_parameter_key.arn
  tags   = merge(local.default_tags, {
    "group" : "db"
  })
}

resource "aws_kms_key" "ssm_parameter_key" {
  description = "Encrypt sensitive parameters"
  tags        = local.default_tags
}
