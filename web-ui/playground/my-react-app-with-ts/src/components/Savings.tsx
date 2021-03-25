// src/components/Savings.tsx

import React from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function Savings() {
    const [savings, setSavings] = React.useState<any[]>([])

    React.useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/savings")
            .then((response) => setSavings(response.data))
            .catch(err => {
                console.log(err);
            });
    }, []);

    const classes = useStyles();

    return (
        <TableContainer component={Paper} >
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Transfer Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Source Account</TableCell>
                        <TableCell>Destination Account</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {savings.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.transfer_date}</TableCell>
                            <TableCell>{row.amount} {row.currency}</TableCell>
                            <TableCell>{row.src_account.name == null ? row.src_account.code : row.src_account.name + " (" + row.src_account.description + ")"}</TableCell>
                            <TableCell>{row.dest_account.name == null ? row.dest_account.code : row.dest_account.name + " (" + row.src_account.description + ")"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Savings;