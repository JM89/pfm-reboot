import pyodbc
from entities.savings_entity import SavingsEntity


class SavingsRepository:
    DB_CONNECTION_STRING = ""

    def __init__(self, config, logger):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]
        self.logger = logger

    def get_savings(self, destination: str, search_from_date: str) -> [SavingsEntity]:
        self.logger.debug("DB operation: get_savings")
        try:
            sql = "SELECT * FROM dbo.Savings WHERE 1=1"
            if destination != '':
                sql += " AND DestBankAccount='%s'" % destination
            if search_from_date != '':
                sql += " AND TransferDate >= '%s'" % search_from_date
            entities = []
            conn = pyodbc.connect(self.DB_CONNECTION_STRING)
            cursor = conn.cursor()
            cursor.execute(sql)
            for row in cursor:
                entities.append(SavingsEntity(row))
            return entities
        except Exception:
            self.logger.exception("Unhandled exception while connecting to the database", exc_info=1)
            raise

    def create_savings(self, entity: SavingsEntity) -> bool:
        self.logger.debug("DB operation: create_savings")
        try:
            conn = pyodbc.connect(self.DB_CONNECTION_STRING, autocommit=False)
            try:
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
            finally:
                conn.rollback()

        except Exception:
            self.logger.exception("Unhandled exception while connecting to the database", exc_info=1)
            raise

    def delete_savings(self, id: int) -> bool:
        self.logger.debug("DB operation: delete_savings")
        try:
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
        except Exception:
            self.logger.exception("Unhandled exception while connecting to the database", exc_info=1)
            raise
