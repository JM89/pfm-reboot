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
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    axios
      .get(`${savingsTrackerApi}/savings`, { adapter })
      .then((res) => {
        setSavings(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Transfer Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Source Account</TableCell>
                <TableCell>Destination Account</TableCell>
                <TableCell>Tax Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savings.slice(page * limit, page * limit + limit).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.transfer_date}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.src_account.name ? `${row.src_account.name} (${row.src_account.description})` : row.src_account.code}</TableCell>
                  <TableCell>{row.dest_account.name ? `${row.dest_account.name} (${row.dest_account.description})` : row.dest_account.code}</TableCell>
                  <TableCell>{row.tax_year_info}</TableCell>
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
        rowsPerPageOptions={[20, 50, 100]}
      />
    </Card>
  );
};

SavingsListResults.propTypes = {
};

export default SavingsListResults;
