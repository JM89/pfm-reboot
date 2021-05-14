from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import configparser
from services.bank_account_services import BankAccountServices
from services.savings_services import SavingsServices

config = configparser.ConfigParser()
config.read('config.ini')

bankAccountSvc = BankAccountServices(config)
savingsSvc = SavingsServices(config)

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/bank-accounts', methods=['GET'])
def get_banks():
    return jsonify(bankAccountSvc.get_all_banks())

@app.route('/bank-accounts', methods=['POST'])
def create_bank():
    new_bank = json.loads(request.data)
    result = bankAccountSvc.create_bank(new_bank)
    if result :
        return jsonify({'message': 'Bank account created successfully', 'status': '200'})
    return jsonify({'message':'Bank account already exists','status':'400'})

@app.route('/savings', methods=['GET'])
def get_savings():
    banks = bankAccountSvc.get_all_banks()
    savings = savingsSvc.get_savings(banks)
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
        return jsonify({'message':'Savings has been deleted successfully','status':'200'})
    return jsonify({'message': 'No Savings could be deleted', 'status': '400'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)