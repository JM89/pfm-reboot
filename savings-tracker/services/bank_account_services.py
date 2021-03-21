import pyodbc

class BankAccountServices():

    DB_CONNECTION_STRING = ""
    def __init__(self, config):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]

    def get_all_banks(self):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM dbo.BankAccounts')
        banks = {}
        for row in cursor:
            banks[row[0]] = {
                "name": row[1],
                "description": row[2]
            }
        return banks

    def create_bank(self, new_bank):

        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()

        cursor.execute('SELECT count(*) FROM dbo.BankAccounts where Code=?', new_bank["code"])
        count = cursor.fetchone()[0]
        if count > 0:
            return False

        cursor.execute("INSERT INTO dbo.[BankAccounts] (Code,[Name],[Description]) VALUES (?,?,?)",
                               new_bank["code"], new_bank["name"], new_bank["description"])
        conn.commit()
        return True