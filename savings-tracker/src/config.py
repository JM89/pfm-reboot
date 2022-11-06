import configparser
import os

CONFIG_FILE = os.environ.get('CONFIG_FILE', 'config')

config = configparser.ConfigParser()
config.read(f'{CONFIG_FILE}.ini')


def get_configs():
    return config


def get_config_section(section='Default'):
    return config[section]


def get_config_value(key, section='Default'):
    return config[section][key]
