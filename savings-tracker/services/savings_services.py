import pyodbc
import datetime

class SavingsServices():

    DB_CONNECTION_STRING = ""
    def __init__(self, config):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]

    def get_savings(self, banks=None):
        savings = []

        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM dbo.Savings')

        for row in cursor:
            src_account = {"code": row[4]}
            if banks and row[4] in banks:
                src_account["name"] = banks[row[4]]["name"]
                src_account["description"] = banks[row[4]]["description"]
            dest_account = {"code": row[5]}
            if banks and row[5] in banks:
                dest_account["name"] = banks[row[5]]["name"]
                dest_account["description"] = banks[row[5]]["description"]
            savings.append({
                "id": row[0],
                "transfer_date": datetime.datetime.strftime(row[1], "%Y-%m-%d"),
                "amount": str(row[2]),
                "currency": row[3],
                "src_account": src_account,
                "dest_account": dest_account,
            })

        return savings

    def create_savings(self, new_savings):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO dbo.[Savings] ([TransferDate],[Amount],[Currency],[SrcBankAccount],[DestBankAccount]) VALUES (?,?,?,?,?)",
                       new_savings["transfer_date"], new_savings["amount"], new_savings["currency"], new_savings["src_account"],new_savings["dest_account"] )
        conn.commit()

        return True

    def delete_savings(self, id):

        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        rows_deleted = cursor.execute("DELETE FROM dbo.[Savings] WHERE Id = ?", id).rowcount
        conn.commit()
        return rows_deleted > 0