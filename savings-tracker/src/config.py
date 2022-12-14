import configparser
import os
from http.client import RemoteDisconnected

import boto3
from botocore.exceptions import EndpointConnectionError
from retry import retry

CONFIG_FILE = os.environ.get('CONFIG_FILE', 'config')

config = configparser.ConfigParser()
config.read(f'{CONFIG_FILE}.ini')

DEFAULT_PARAMETER_STORE_ERROR_MSG = "Error when initializing the configurations from aws parameter store."


class MissingConfigException(Exception):
    def __init__(self, parameter_name: str):
        self.message = f'{parameter_name} is missing'

    def __str__(self):
        return self.message


class ParameterStoreNotOkStatus(Exception):
    def __init__(self, http_status: str):
        self.message = f"AWS status code is not ok: {http_status}"

    def __str__(self):
        return self.message


def get_configs():
    return config


def get_config_section(section='Default'):
    if section not in config:
        return None
    return config[section]


def get_config_value(key, section='Default'):
    if section not in config or key not in config[section]:
        return None
    return config[section][key]


def ensure_success_code(response: dict) -> bool:
    if response["ResponseMetadata"]["HTTPStatusCode"] != 200:
        raise ParameterStoreNotOkStatus(response["ResponseMetadata"]["HTTPStatusCode"])
    return True


def ensure_no_missing_configs(parameters, expected_parameter_names) -> bool:
    for parameter_name in expected_parameter_names:
        if parameter_name not in parameters:
            raise MissingConfigException(parameter_name)
    return True


@retry(EndpointConnectionError, tries=10, delay=1, backoff=2)
@retry(RemoteDisconnected, tries=10, delay=1, backoff=2)
def get_parameters_from_aws() -> configparser.ConfigParser:
    print("access aws parameter store for configs")

    region = get_config_value("Region", "AWS")
    service_url = get_config_value("Endpoint", "AWS")
    try:
        client = boto3.client('ssm', region_name=region, endpoint_url=service_url)

        all_params_response = client.describe_parameters(
            ParameterFilters=[{'Key': 'tag:app', 'Values': ['savings-tracker']}]
        )
        ensure_success_code(all_params_response)

        parameters = {}
        parameter_names = list(map(lambda pm: pm["Name"], all_params_response["Parameters"]))
        for p in parameter_names:
            param_details_response = client.get_parameter(
                Name=p,
                WithDecryption=True
            )
            ensure_success_code(param_details_response)
            p = param_details_response["Parameter"]
            parameters[p["Name"]] = p["Value"]

        ensure_no_missing_configs(parameters, ["/db/connection_string", "/log-agent/host", "/log-agent/port"])

        config_from_aws = configparser.ConfigParser()
        config_from_aws['DEFAULT'] = {
            'DbConnectionString': parameters["/db/connection_string"].replace("#{Pwd}", parameters["/db/password"])
        }
        config_from_aws['LoggerConfig'] = {
            'LogAgentHost': parameters["/log-agent/host"],
            'LogAgentPort': parameters["/log-agent/port"]
        }
        return config_from_aws

    except (MissingConfigException, ParameterStoreNotOkStatus) as ex:
        print(str(ex))
        raise Exception(DEFAULT_PARAMETER_STORE_ERROR_MSG)


if get_config_section("AWS") is not None:
    config = get_parameters_from_aws()
