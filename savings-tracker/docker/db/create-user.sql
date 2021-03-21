IF NOT EXISTS (SELECT * 
    FROM sys.database_principals
    WHERE name = 'SavingsSvc')
BEGIN

    CREATE LOGIN SavingsSvc   
        WITH PASSWORD = '340Uuxwp7Mcxo7Khy'

	USE Savings

    CREATE USER SavingsSvc FOR LOGIN SavingsSvc

    GRANT SELECT, INSERT, UPDATE, DELETE TO SavingsSvc;

END