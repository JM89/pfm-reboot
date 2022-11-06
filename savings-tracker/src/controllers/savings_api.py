from config import get_configs
import json

from flask import Blueprint
from flask import request, jsonify
from flasgger import swag_from

from contracts.savings_filter_request import SavingsFilterRequest
from core.generic_logger import get_logger
from core.timer import Timer
from services.savings_services import SavingsServices
from services.bank_account_services import BankAccountServices

config = get_configs()

logger = get_logger("bank-accounts-api", config['LoggerConfig'])

savings_api = Blueprint('savings', __name__)
timer = Timer(logger)

savingsSvc = SavingsServices(config, logger)
bankAccountSvc = BankAccountServices(config, logger)


@savings_api.route('/', methods=['GET'])
@swag_from('docs/get_savings.yml')
def get_savings():
    timer.start("API action: create_savings")
    try:
        filters = SavingsFilterRequest(request.args.get('destination', ''), request.args.get('searchFromDate', ''))
        banks = bankAccountSvc.get_all_banks()
        savings = savingsSvc.get_savings(filters, banks)
        if savings is None:
            return jsonify({'message': 'Unhandled exception occurred, check your logs', 'status': '500'})
        else:
            return jsonify(savings)
    finally:
        timer.stop()


@savings_api.route('/', methods=['POST'])
@swag_from('docs/create_savings.yml', validation=True)
def create_savings():
    timer.start("API action: create_savings")
    try:
        new_savings = json.loads(request.data)
        result = savingsSvc.create_savings(new_savings)
        if result:
            return jsonify({'message': 'Savings created successfully', 'status': '200'})
        return jsonify({'message': 'Savings could not be created', 'status': '400'})
    finally:
        timer.stop()


@savings_api.route('/<id>', methods=['DELETE'])
@swag_from('docs/delete_savings.yml')
def delete_savings(id: int):
    timer.start("API action: delete_savings")
    try:
        result = savingsSvc.delete_savings(id)
        if result:
            return jsonify({'message': 'Savings has been deleted successfully', 'status': '200'})
        return jsonify({'message': 'No Savings could be deleted', 'status': '400'})
    finally:
        timer.stop()
