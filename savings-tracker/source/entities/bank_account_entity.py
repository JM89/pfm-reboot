import pyodbc


class BankAccountEntity:

    def __init__(self, row):
        if isinstance(row, pyodbc.Row):
            self.Code = row[0]
            self.Name = row[1]
            self.Description = row[2]
            self.SavingsPot = row[3]
        else:
            self.Code = row["code"]
            self.Name = row["name"]
            self.Description = row["description"]
            self.SavingsPot = row["savings_pot"]
