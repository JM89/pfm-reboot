import configparser

config = configparser.ConfigParser()
config.read('../configs/config.ini')


def get_configs():
    return config


def get_config_section(section='Default'):
    return config[section]


def get_config_value(key, section='Default'):
    return config[section][key]
