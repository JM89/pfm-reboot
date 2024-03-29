import datetime
from contracts.savings_filter_request import SavingsFilterRequest
from repositories.savings_repository import SavingsRepository
from entities.savings_entity import SavingsEntity


class SavingsServices:

    def __init__(self, config, logger):
        self.savings_repository = SavingsRepository(config, logger)
        self.logger = logger

    def get_savings(self, filters: SavingsFilterRequest, banks=None) -> {object}:
        try:
            entities = self.savings_repository.get_savings(filters.Destination, filters.SearchFromDate)
            savings = []
            for entity in entities:
                src_account = {"code": entity.SrcBankAccount}
                if banks and entity.SrcBankAccount in banks:
                    src_account["name"] = banks[entity.SrcBankAccount]["name"]
                    src_account["description"] = banks[entity.SrcBankAccount]["description"]
                dest_account = {"code": entity.DestBankAccount}
                if banks and entity.DestBankAccount in banks:
                    dest_account["name"] = banks[entity.DestBankAccount]["name"]
                    dest_account["description"] = banks[entity.DestBankAccount]["description"]
                savings.append({
                    "id": entity.Id,
                    "transfer_date": datetime.datetime.strftime(entity.TransferDate, "%Y-%m-%d"),
                    "amount": str(entity.Amount),
                    "currency": entity.Currency,
                    "src_account": src_account,
                    "dest_account": dest_account,
                    "tax_year_info": entity.TaxYearInfo,
                })
            return savings
        except:
            return None

    def create_savings(self, new_savings: dict) -> bool:
        try:
            new_savings["uk_tax_year_info"] = self.retrieve_tax_year_info(new_savings["transfer_date"])
            entity = SavingsEntity(new_savings)
            return self.savings_repository.create_savings(entity)
        except:
            return False

    def delete_savings(self, id: int) -> bool:
        try:
            return self.savings_repository.delete_savings(id)
        except:
            return False

    @staticmethod
    def retrieve_tax_year_info(input_transfer_date: str) -> str:
        transfer_date = datetime.datetime.strptime(input_transfer_date.strip('Z'), '%Y-%m-%dT%H:%M:%S.%f')
        uk_tax_year_cut_off_date = datetime.datetime.strptime(str(transfer_date.year) + '-04-06', "%Y-%m-%d")
        uk_tax_year_info = "Tax Year"
        if transfer_date < uk_tax_year_cut_off_date:
            uk_tax_year_info = f'{uk_tax_year_info} {str(transfer_date.year - 1)}/{str(transfer_date.year)}'
        else:
            uk_tax_year_info = f'{uk_tax_year_info} {str(transfer_date.year)}/{str(transfer_date.year + 1)}'
        return uk_tax_year_info
