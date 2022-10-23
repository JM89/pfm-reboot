from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import configparser
from services.bank_account_services import BankAccountServices
from services.savings_services import SavingsServices
from contracts.savings_filter_request import SavingsFilterRequest
from flask import Response
from core.timer import Timer

config = configparser.ConfigParser()
config.read('config.ini')

bankAccountSvc = BankAccountServices(config)
savingsSvc = SavingsServices(config)

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

timer = Timer()

@app.route('/bank-accounts', methods=['GET'])
def get_banks():
    timer.start("Get all bank accounts")
    result = bankAccountSvc.get_all_banks()
    if result == None:
        response = Response("Unhandled exception occurred, check your logs", status=500, mimetype='application/json')
    else:
        response = jsonify(result)
    timer.stop()
    return response


@app.route('/bank-accounts', methods=['POST'])
def create_bank():
    new_bank = json.loads(request.data)
    result = bankAccountSvc.create_bank(new_bank)
    if result:
        return jsonify({'message': 'Bank account created successfully', 'status': '200'})
    return jsonify({'message': 'Bank account already exists', 'status': '400'})


@app.route('/savings', methods=['GET'])
def get_savings():
    filters = SavingsFilterRequest(request.args.get('destination', ''), request.args.get('searchFromDate', ''))
    banks = bankAccountSvc.get_all_banks()
    savings = savingsSvc.get_savings(filters, banks)
    return jsonify(savings)


@app.route('/savings', methods=['POST'])
def create_savings():
    new_savings = json.loads(request.data)
    result = savingsSvc.create_savings(new_savings)
    if result:
        return jsonify({'message': 'Savings created successfully', 'status': '200'})
    return jsonify({'message': 'Savings could not be created', 'status': '400'})


@app.route('/savings/<id>', methods=['DELETE'])
def delete_savings(id):
    result = savingsSvc.delete_savings(id)
    if result:
        return jsonify({'message': 'Savings has been deleted successfully', 'status': '200'})
    return jsonify({'message': 'No Savings could be deleted', 'status': '400'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)