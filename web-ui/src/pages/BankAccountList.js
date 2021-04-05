import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import BankAccountListResults from 'src/components/bankaccounts/BankAccountListResults';
import BankAccountListToolbar from 'src/components/bankaccounts/BankAccountListToolbar';

const BankAccountList = () => (
  <>
    <Helmet>
      <title>Bank Accounts</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <BankAccountListToolbar />
        <Box sx={{ pt: 3 }}>
          <BankAccountListResults />
        </Box>
      </Container>
    </Box>
  </>
);

export default BankAccountList;
