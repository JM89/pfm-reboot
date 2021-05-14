import { useState, useEffect } from 'react';
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
import adapter from 'axios/lib/adapters/http';
import config from '../../config/default.json';

const savingsTrackerApi = config.savingsTrackerUrl;

const SavingsListResults = ({ ...rest }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    axios
      .get(`${savingsTrackerApi}/savings`, { adapter })
      .then((response) => setSavings(response.data));
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
                <TableCell>Transfer Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Source Account</TableCell>
                <TableCell>Destination Account</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savings.slice(0, limit).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.transfer_date}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.src_account.name ? `${row.src_account.name} (${row.src_account.description})` : row.src_account.code}</TableCell>
                  <TableCell>{row.dest_account.name ? `${row.dest_account.name} (${row.dest_account.description})` : row.dest_account.code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={savings.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

SavingsListResults.propTypes = {
};

export default SavingsListResults;
