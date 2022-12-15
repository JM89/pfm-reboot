import pyodbc
from entities.bank_account_entity import BankAccountEntity


class BankAccountRepository:
    DB_CONNECTION_STRING = ""

    def __init__(self, config, logger):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]
        self.logger = logger

    def check_if_exists(self, code: str) -> bool:
        self.logger.debug("DB operation: check_if_exists")
        try:
            conn = pyodbc.connect(self.DB_CONNECTION_STRING)
            cursor = conn.cursor()

            cursor.execute('SELECT count(*) FROM dbo.BankAccounts where Code=?', code)
            count = cursor.fetchone()[0]
            if count > 0:
                return True
            return False
        except Exception:
            self.logger.exception("Unhandled exception while connecting to the database", exc_info=1)
            raise

    def get_all_banks(self) -> [BankAccountEntity]:
        self.logger.debug("DB operation: get_all_banks")
        entities = []
        try:
            conn = pyodbc.connect(self.DB_CONNECTION_STRING)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM dbo.BankAccounts')
            for row in cursor:
                entities.append(BankAccountEntity(row))
            return entities
        except Exception:
            self.logger.exception("Unhandled exception while connecting to the database", exc_info=1)
            raise

    def create_bank(self, entity: BankAccountEntity) -> bool:
        self.logger.debug("DB operation: create_bank")
        try:
            conn = pyodbc.connect(self.DB_CONNECTION_STRING)
            cursor = conn.cursor()

            cursor.execute("INSERT INTO dbo.[BankAccounts] (Code,[Name],[Description],[SavingsPot]) VALUES (?,?,?,?)",
                           entity.Code,
                           entity.Name,
                           entity.Description,
                           entity.SavingsPot)
            conn.commit()
            return True
        except Exception:
            self.logger.exception("Unhandled exception while connecting to the database", exc_info=1)
            raise
