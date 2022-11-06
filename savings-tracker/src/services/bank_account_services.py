from entities.bank_account_entity import BankAccountEntity
from repositories.bank_account_repository import BankAccountRepository


class BankAccountServices:

    def __init__(self, config, logger):
        self.bank_account_repository = BankAccountRepository(config, logger)
        self.logger = logger

    def get_all_banks(self) -> dict:
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

    def create_bank(self, new_bank: dict) -> bool:
        try:
            if self.bank_account_repository.check_if_exists(new_bank["code"]):
                return False
            entity = BankAccountEntity(new_bank)
            return self.bank_account_repository.create_bank(entity)
        except:
            return False
