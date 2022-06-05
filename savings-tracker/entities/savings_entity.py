import pyodbc


class SavingsEntity:

    def __init__(self, row):
        if isinstance(row, pyodbc.Row):
            self.Id = row[0]
            self.TransferDate = row[1]
            self.Amount = row[2]
            self.Currency = row[3]
            self.SrcBankAccount = row[4]
            self.DestBankAccount = row[5]
            self.TaxYearInfo = row[6]
        else:
            self.TransferDate = row["transfer_date"]
            self.Amount = row["amount"]
            self.Currency = row["currency"]
            self.SrcBankAccount = row["src_account"]
            self.DestBankAccount = row["dest_account"]
            self.TaxYearInfo = row["uk_tax_year_info"]
