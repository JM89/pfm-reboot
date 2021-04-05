import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import axios from 'axios';

const SavingsListResults = ({ ...rest }) => {
  const [selectedSavingsEntries, setselectedSavingsEntries] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/savings')
      .then((response) => setSavings(response.data));
  }, []);

  const handleSelectAll = (event) => {
    let newselectedSavingsEntries;

    if (event.target.checked) {
      newselectedSavingsEntries = savings.map((customer) => customer.id);
    } else {
      newselectedSavingsEntries = [];
    }

    setselectedSavingsEntries(newselectedSavingsEntries);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedSavingsEntries.indexOf(id);
    let newselectedSavingsEntries = [];

    if (selectedIndex === -1) {
      newselectedSavingsEntries = newselectedSavingsEntries.concat(selectedSavingsEntries, id);
    } else if (selectedIndex === 0) {
      newselectedSavingsEntries = newselectedSavingsEntries.concat(selectedSavingsEntries.slice(1));
    } else if (selectedIndex === selectedSavingsEntries.length - 1) {
      newselectedSavingsEntries = newselectedSavingsEntries.concat(selectedSavingsEntries.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedSavingsEntries = newselectedSavingsEntries.concat(
        selectedSavingsEntries.slice(0, selectedIndex),
        selectedSavingsEntries.slice(selectedIndex + 1)
      );
    }

    setselectedSavingsEntries(newselectedSavingsEntries);
  };

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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSavingsEntries.length === savings.length}
                    color="primary"
                    indeterminate={
                      selectedSavingsEntries.length > 0
                      && selectedSavingsEntries.length < savings.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Transfer Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Source Account</TableCell>
                <TableCell>Destination Account</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savings.slice(0, limit).map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  selected={selectedSavingsEntries.indexOf(row.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSavingsEntries.indexOf(row.id) !== -1}
                      onChange={(event) => handleSelectOne(event, row.id)}
                      value="true"
                    />
                  </TableCell>
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
