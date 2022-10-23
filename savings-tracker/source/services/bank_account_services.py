from src.entities.bank_account_entity import BankAccountEntity
from src.repositories.bank_account_repository import BankAccountRepository


class BankAccountServices:

    def __init__(self, config):
        self.bank_account_repository = BankAccountRepository(config)

    def get_all_banks(self):
        try:
            entities = self.bank_account_repository.get_all_banks()
            banks = {}
            for entity in entities:
                banks[entity.Code] = {
                    "name": entity.Name,
                    "description": entity.Description,
                    "savings_pot": str(entity.SavingsPot)
                }
            return banks
        except:
            return None

    def create_bank(self, new_bank):
        if self.bank_account_repository.check_if_exists(new_bank["code"]):
            return False
        entity = BankAccountEntity(new_bank)
        return self.bank_account_repository.create_bank(entity)