import pyodbc
import datetime
from contracts.savings_filter_request import SavingsFilterRequest


class SavingsServices():
    DB_CONNECTION_STRING = ""

    def __init__(self, config):
        self.DB_CONNECTION_STRING = config['DEFAULT']["DbConnectionString"]

    def get_savings(self, filters: SavingsFilterRequest, banks=None):
        sql = "SELECT * FROM dbo.Savings WHERE 1=1"
        if filters.getDestination()!='':
            sql += " AND DestBankAccount='%s'" % filters.getDestination()
        if filters.getSearchFromDate()!='':
            sql += " AND TransferDate >= '%s'" % filters.getSearchFromDate()

        savings = []

        conn = pyodbc.connect(self.DB_CONNECTION_STRING)
        cursor = conn.cursor()
        cursor.execute(sql)

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
                "tax_year_info": row[6],
            })

        return savings

    def create_savings(self, new_savings):
        conn = pyodbc.connect(self.DB_CONNECTION_STRING, autocommit=False)
        cursor = conn.cursor()

        uk_tax_year_info = self.retrieve_tax_year_info(new_savings["transfer_date"])

        cursor.execute(
            "INSERT INTO dbo.[Savings] ([TransferDate],[Amount],[Currency],[SrcBankAccount],[DestBankAccount],[TaxYearInfo]) VALUES (?,?,?,?,?,?)",
            new_savings["transfer_date"], new_savings["amount"], new_savings["currency"], new_savings["src_account"],
            new_savings["dest_account"], uk_tax_year_info)
        cursor.execute(
            "UPDATE dbo.[BankAccounts] SET SavingsPot = SavingsPot - ? WHERE Code=?", new_savings["amount"],
            new_savings["src_account"])
        cursor.execute(
            "UPDATE dbo.[BankAccounts] SET SavingsPot = SavingsPot + ? WHERE Code=?", new_savings["amount"],
            new_savings["dest_account"])
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

    def retrieve_tax_year_info(self, input_transfer_date):
        transfer_date = datetime.datetime.strptime(input_transfer_date.strip('Z'), '%Y-%m-%dT%H:%M:%S.%f')
        uk_tax_year_cut_off_date = datetime.datetime.strptime(str(transfer_date.year) + '-04-06', "%Y-%m-%d")
        uk_tax_year_info = "Tax Year"
        if transfer_date < uk_tax_year_cut_off_date:
            uk_tax_year_info = f'{uk_tax_year_info} {str(transfer_date.year - 1)}/{str(transfer_date.year)}'
        else:
            uk_tax_year_info = f'{uk_tax_year_info} {str(transfer_date.year)}/{str(transfer_date.year + 1)}'
        return uk_tax_year_info
