from flasgger import Swagger
from flask import Flask

from controllers.bank_account_api import bank_account_api
from controllers.savings_api import savings_api


def create_app():
    app = Flask(__name__)

    app.config['SWAGGER'] = {
        'title': 'Savings Tracker API',
        'uiversion': 3,
        'openapi': '3.0.3',
        'persistAuthorization': True,
    }
    swagger = Swagger(app)
    app.config.from_pyfile('config.py')
    app.register_blueprint(bank_account_api, url_prefix='/bank-accounts')
    app.register_blueprint(savings_api, url_prefix='/savings')

    return app


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app = create_app()

    app.run(host='0.0.0.0', port=port, debug=True)
