IF NOT EXISTS(SELECT 1 FROM master.sys.databases WHERE Name = 'Savings')
	CREATE DATABASE Savings;

