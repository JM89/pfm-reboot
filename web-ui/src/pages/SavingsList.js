import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import SavingsListResults from 'src/components/savings/SavingsListResults';
import SavingsListToolbar from 'src/components/savings/SavingsListToolbar';

const SavingsList = () => (
  <>
    <Helmet>
      <title>Savings</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <SavingsListToolbar />
        <Box sx={{ pt: 3 }}>
          <SavingsListResults />
        </Box>
      </Container>
    </Box>
  </>
);

export default SavingsList;
