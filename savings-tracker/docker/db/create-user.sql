IF SUSER_ID('SavingsSvc') IS NULL
    CREATE LOGIN SavingsSvc WITH PASSWORD = '340Uuxwp7Mcxo7Khy'

USE Savings
IF USER_ID('SavingsSvc') IS NULL
BEGIN
    CREATE USER SavingsSvc FOR LOGIN SavingsSvc

    GRANT SELECT, INSERT, UPDATE, DELETE TO SavingsSvc;
END 