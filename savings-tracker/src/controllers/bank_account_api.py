import json

from flasgger import swag_from
from flask import Blueprint
from flask import request

from config import get_configs, get_config_section
from core.api_action_wrapper import api_action
from core.generic_logger import get_logger
from core.timer import Timer
from services.bank_account_services import BankAccountServices

logger = get_logger("bank-accounts-api", get_config_section('LoggerConfig'))

bank_account_api = Blueprint('bank-accounts', __name__)
timer = Timer(logger)

config = get_configs()
bankAccountSvc = BankAccountServices(config, logger)


@bank_account_api.route('/', methods=['GET'])
@api_action
@swag_from('docs/get_banks.yml')
def get_banks():
    """Get all banks"""
    result = bankAccountSvc.get_all_banks()
    if result is None:
        result = {'message': 'Unhandled exception occurred, check your logs', 'status': '500'}
    return result


@bank_account_api.route('/', methods=['POST'])
@api_action
@swag_from('docs/create_bank.yml', validation=True)
def create_bank():
    """Create a bank"""
    new_bank = json.loads(request.data)
    result = bankAccountSvc.create_bank(new_bank)
    if result:
        return {'message': 'Bank account created successfully', 'status': '200'}
    return {'message': 'Bank account already exists', 'status': '400'}
