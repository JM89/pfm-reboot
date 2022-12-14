import unittest

class TestBankAccounts(unittest.TestCase):

    def test_bank_account_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')
