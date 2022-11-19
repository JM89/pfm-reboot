import configparser
import os

import boto3

CONFIG_FILE = os.environ.get('CONFIG_FILE', 'config')

config = configparser.ConfigParser()
config.read(f'{CONFIG_FILE}.ini')


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
        raise Exception("AWS status code is not ok")
    return True


def get_parameters_from_aws() -> configparser.ConfigParser:
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

        config_from_aws = configparser.ConfigParser()
        config_from_aws['DEFAULT'] = {
            'DbConnectionString': parameters["/db/connection_string"].replace("#{Pwd}", parameters["/db/password"])
        }
        config_from_aws['LoggerConfig'] = {
            'LogAgentHost': parameters["/log-agent/host"],
            'LogAgentPort': parameters["/log-agent/port"]
        }
        return config_from_aws

    except:
        raise Exception("error when initializing the configurations from aws parameter store")


if get_config_section("AWS") is not None:
    config = get_parameters_from_aws()
