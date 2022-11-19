variable "environment" {
  description = "Target environment"
  type        = string
  default     = "local"
}

variable "log_agent_host" {
  description = "Log agent hostname."
  type        = string
  default     = "127.0.0.1"
}

variable "log_agent_port" {
  description = "Log agent listener port."
  type        = number
  default     = 12201
}

variable "db_connection_string" {
  description = "DB Connection String"
  type        = string
  default     = "Driver={SQL Server};Server=localhost,1433;Database=Savings;UID=SavingsSvc;PWD=#{Pwd}"
}
