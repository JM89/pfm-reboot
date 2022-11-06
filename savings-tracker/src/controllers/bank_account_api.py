from config import get_configs, get_config_section
import json

from flask import Blueprint
from flask import request, jsonify
from flasgger import swag_from

from core.generic_logger import get_logger
from core.timer import Timer
from services.bank_account_services import BankAccountServices

logger = get_logger("bank-accounts-api", get_config_section('LoggerConfig'))

bank_account_api = Blueprint('bank-accounts', __name__)
timer = Timer(logger)

config = get_configs()
bankAccountSvc = BankAccountServices(config, logger)


@bank_account_api.route('/', methods=['GET'])
@swag_from('docs/get_banks.yml')
def get_banks():
    timer.start("API action: get_banks")
    try:
        result = bankAccountSvc.get_all_banks()
        if result is None:
            response = jsonify({'message': 'Unhandled exception occurred, check your logs', 'status': '500'})
        else:
            response = jsonify(result)
    finally:
        timer.stop()
    return response


@bank_account_api.route('/', methods=['POST'])
@swag_from('docs/create_bank.yml', validation=True)
def create_bank():
    timer.start("API action: create_bank")
    try:
        new_bank = json.loads(request.data)
        result = bankAccountSvc.create_bank(new_bank)
        if result:
            return jsonify({'message': 'Bank account created successfully', 'status': '200'})
        return jsonify({'message': 'Bank account already exists', 'status': '400'})
    finally:
        timer.stop()
    return response
