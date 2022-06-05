class SavingsFilterRequest:
    def __init__(self):
        self.destination = ''
        self.searchFromDate = ''

    def setDestination(self, destination: str):
        self.destination = destination

    def getDestination(self):
        return self.destination

    def setSearchFromDate(self, searchFromDate: str):
        self.searchFromDate = searchFromDate

    def getSearchFromDate(self):
        return self.searchFromDate
