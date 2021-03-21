IF NOT EXISTS(SELECT 1 FROM Savings.sys.tables where NAME = 'BankAccounts' )
BEGIN	
	CREATE TABLE BankAccounts (
		Code VARCHAR(3) NOT NULL,
		Name VARCHAR(255) NOT NULL,
		Description NVARCHAR(255) NOT NULL
		PRIMARY KEY (Code)
	);
END

IF NOT EXISTS(SELECT 1 FROM Savings.sys.tables where NAME = 'Savings' )
BEGIN	
	CREATE TABLE Savings (
		Id INT NOT NULL IDENTITY(1,1),
		TransferDate DATETIME NOT NULL,
		Amount DECIMAL(18,2) NOT NULL,
		Currency VARCHAR(3) NOT NULL,
		SrcBankAccount VARCHAR(3) NOT NULL,
		DestBankAccount VARCHAR(3) NOT NULL,
		PRIMARY KEY (Id)
	);
END
