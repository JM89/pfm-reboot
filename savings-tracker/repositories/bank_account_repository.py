import pyodbc
from entities.bank_account_entity import BankAccountEntity


class BankAccountRepository():

    DB_CONNECTION_STRING = ""

    def __init__(self, config):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]

    def check_if_exists(self, code):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()

        cursor.execute('SELECT count(*) FROM dbo.BankAccounts where Code=?', code)
        count = cursor.fetchone()[0]
        if count > 0:
            return True
        return False

    def get_all_banks(self):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM dbo.BankAccounts')
        entities = []
        for row in cursor:
            entities.append(BankAccountEntity(row))
        return entities

    def create_bank(self, entity: BankAccountEntity):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()

        cursor.execute("INSERT INTO dbo.[BankAccounts] (Code,[Name],[Description],[SavingsPot]) VALUES (?,?,?,?)",
                       entity.Code,
                       entity.Name,
                       entity.Description,
                       entity.SavingsPot)
        conn.commit()
        return True