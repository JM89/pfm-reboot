import pyodbc
import datetime
from entities.savings_entity import SavingsEntity


class SavingsRepository:
    DB_CONNECTION_STRING = ""

    def __init__(self, config):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]

    def get_savings(self, destination: str, searchFromDate: str):
        sql = "SELECT * FROM dbo.Savings WHERE 1=1"
        if destination != '':
            sql += " AND DestBankAccount='%s'" % destination
        if searchFromDate != '':
            sql += " AND TransferDate >= '%s'" % searchFromDate
        entities = []
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute(sql)
        for row in cursor:
            entities.append(SavingsEntity(row))
        return entities

    def create_savings(self, entity: SavingsEntity):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING, autocommit=False)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO dbo.[Savings] ([TransferDate],[Amount],[Currency],[SrcBankAccount],[DestBankAccount],[TaxYearInfo]) VALUES (?,?,?,?,?,?)",
            entity.TransferDate,
            entity.Amount,
            entity.Currency,
            entity.SrcBankAccount,
            entity.DestBankAccount,
            entity.TaxYearInfo)
        cursor.execute(
            "UPDATE dbo.[BankAccounts] SET SavingsPot = SavingsPot - ? WHERE Code=?",
            entity.Amount,
            entity.SrcBankAccount)
        cursor.execute(
            "UPDATE dbo.[BankAccounts] SET SavingsPot = SavingsPot + ? WHERE Code=?",
            entity.Amount,
            entity.DestBankAccount)
        conn.commit()

        return True

    def delete_savings(self, id):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute('SELECT SrcBankAccount, DestBankAccount, Amount FROM dbo.[Savings] WHERE Id = ?', id)
        savings = cursor.fetchone()
        if savings:
            cursor.execute(
                "UPDATE dbo.[BankAccounts] SET SavingsPot = SavingsPot + ? WHERE Code=?", savings[2], savings[0])
            cursor.execute(
                "UPDATE dbo.[BankAccounts] SET SavingsPot = SavingsPot - ? WHERE Code=?", savings[2], savings[1])
            rows_deleted = cursor.execute("DELETE FROM dbo.[Savings] WHERE Id = ?", id).rowcount
            conn.commit()
            return rows_deleted > 0
        return False