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
  TableRow,
  CardContent,
  Button
} from '@material-ui/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import config from '../../config/default.json';

const savingsTrackerApi = config.savingsTrackerUrl;

const SavingsListResults = ({ ...rest }) => {
  const defaultSearchDate = new Date(new Date().getFullYear(), 3, 5);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [savings, setSavings] = useState([]);
  const [searchDateFrom, setSearchDateFrom] = useState(defaultSearchDate);
  const [searchDestination, setSearchDestination] = useState();
  const [bankAccounts, setBankAccounts] = useState([]);

  const retrieveSavings = () => {
    const formattedSearchFromDate = searchDateFrom.toISOString().slice(0, 10);

    axios
      .get(`${savingsTrackerApi}/savings`, { params: { destination: searchDestination, searchFromDate: formattedSearchFromDate } }, { adapter })
      .then((res) => {
        setSavings(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const retrieveBankAccounts = () => {
    axios
      .get(`${savingsTrackerApi}/bank-accounts`, { adapter })
      .then((response) => setBankAccounts(Object.entries(response.data).map(([key, value]) => ({
        code: key,
        name: value.name,
        description: value.description,
        savings_pot: value.savings_pot
      }))));
  };

  useEffect(() => {
    retrieveSavings();
    retrieveBankAccounts();
  }, []);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <label htmlFor="searchDateFrom">
              <div className="customDatePickerWidth">
                <p>Search from: </p>
                <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */}</>
                <DatePicker selected={searchDateFrom} dateFormat="dd/MM/yyyy" onChange={(date) => setSearchDateFrom(date)} />
              </div>
            </label>
            <label htmlFor="destaccount">
              <p>Destination:</p>
              <select id="destaccount" name="destaccount" onChange={(val) => setSearchDestination(val.target.value)}>
                <option value="">Choose...</option>
                {bankAccounts.map((bankAccount) => (
                  <option value={bankAccount.code}>{bankAccount.name}</option>
                ))}
              </select>
            </label>
            <Button className="button" onClick={() => { retrieveSavings(); }}>
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>
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
    </Box>
  );
};

SavingsListResults.propTypes = {
};

export default SavingsListResults;
