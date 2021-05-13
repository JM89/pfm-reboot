import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import axios from 'axios';

const BankAccountListResults = ({ ...rest }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/bank-accounts')
      .then((response) => setBankAccounts(Object.entries(response.data).map(([key, value]) => ({
        code: key,
        name: value.name,
        description: value.description,
        savings_pot: value.savings_pot
      }))));
  }, []);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Code
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Savings Pot
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankAccounts.slice(0, limit).map((bankAccount) => (
                <TableRow
                  hover
                  key={bankAccount.code}
                >
                  <TableCell>
                    {bankAccount.code}
                  </TableCell>
                  <TableCell>
                    {bankAccount.name}
                  </TableCell>
                  <TableCell>
                    {bankAccount.description}
                  </TableCell>
                  <TableCell>
                    {bankAccount.savings_pot}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={bankAccounts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

BankAccountListResults.propTypes = {
};

export default BankAccountListResults;
