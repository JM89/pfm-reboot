import json

from flasgger import swag_from
from flask import Blueprint
from flask import request

from config import get_configs
from contracts.savings_filter_request import SavingsFilterRequest
from core.api_action_wrapper import api_action
from core.generic_logger import get_logger
from core.timer import Timer
from services.bank_account_services import BankAccountServices
from services.savings_services import SavingsServices

config = get_configs()

logger = get_logger("savings-api", config['LoggerConfig'])

savings_api = Blueprint('savings', __name__)
timer = Timer(logger)

savingsSvc = SavingsServices(config, logger)
bankAccountSvc = BankAccountServices(config, logger)


@savings_api.route('/', methods=['GET'])
@api_action
@swag_from('docs/get_savings.yml')
def get_savings():
    """Get all savings"""
    filters = SavingsFilterRequest(request.args.get('destination', ''), request.args.get('searchFromDate', ''))
    banks = bankAccountSvc.get_all_banks()
    savings = savingsSvc.get_savings(filters, banks)
    if savings is None:
        savings = {'message': 'Unhandled exception occurred, check your logs', 'status': '500'}
    return savings


@savings_api.route('/', methods=['POST'])
@api_action
@swag_from('docs/create_savings.yml', validation=True)
def create_savings():
    """Create a savings movement"""
    new_savings = json.loads(request.data)
    result = savingsSvc.create_savings(new_savings)
    if result:
        return {'message': 'Savings created successfully', 'status': '200'}
    return {'message': 'Savings could not be created', 'status': '400'}


@savings_api.route('/<id>', methods=['DELETE'])
@api_action
@swag_from('docs/delete_savings.yml')
def delete_savings(id: int):
    """Delete a savings movement"""
    result = savingsSvc.delete_savings(id)
    if result:
        return {'message': 'Savings has been deleted successfully', 'status': '200'}
    return {'message': 'No Savings could be deleted', 'status': '400'}
