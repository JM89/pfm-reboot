// src/components/Savings.tsx


import { useReducer, useState, useEffect } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const formReducer = function (state: any, event: any) {
    if (event.reset) {
        return {
            amount: '',
            transfer_date: '',
            currency: '',
            src_account: '',
            dest_account: ''
        }
    }
    return {
        ...state,
        [event.name]: event.value
    }
}

function Savings() {
    const [savings, setSavings] = useState<any[]>([])
    const [bankAccounts, setBankAccounts] = useState<any[]>([])
    const [transfer_date, setTransferDate] = useState<any>()

    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState<boolean>(false);
    const handleSubmit = function (event: any) {
        event.preventDefault();
        setSubmitting(true);

        axios.post("http://127.0.0.1:5000/savings", {
            amount: formData['amount'],
            transfer_date: transfer_date,
            currency: formData['currency'],
            src_account: formData['src_account'],
            dest_account: formData['dest_account']
        }).then(function (response) {
            axios
                .get("http://127.0.0.1:5000/savings")
                .then((response) => setSavings(response.data));
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });

        setTimeout(() => {
            setSubmitting(false);
            setFormData({
                reset: true
            })
        }, 3000)
    }

    const handleChange = function (event: any) {
        setFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/savings")
            .then((response) => setSavings(response.data))
            .catch(err => {
                console.log(err);
            });
        axios
            .get("http://127.0.0.1:5000/bank-accounts")
            .then((response) => setBankAccounts(response.data));
    }, []);

    const classes = useStyles();

    return (
        <div className="wrapper">
            <h3>Create</h3>
            {submitting &&
                <div>
                    You are submitting the following:
                    <ul>
                        {Object.entries(formData).map(([name, value]) => (
                            <li key={name}><strong>{name}</strong>:{value}</li>
                        ))}
                    </ul>
                </div>
            }
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        <p>Source Bank Account:</p>
                        <select name="src_account" onChange={handleChange}>
                            <option value="">--Please choose an option--</option>
                            {Object.entries(bankAccounts).map(([key, value]) =>
                                <option value={key}>{value.name}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        <p>Destination Bank Account:</p>
                        <select name="dest_account" onChange={handleChange}>
                            <option value="">--Please choose an option--</option>
                            {Object.entries(bankAccounts).map(([key, value]) =>
                                <option value={key}>{value.name}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        <p>Transfer Date</p>
                        <DatePicker selected={transfer_date} onChange={date => setTransferDate(date)} />
                    </label>
                    <label>
                        <p>Amount</p>
                        <input name="amount" onChange={handleChange} value={formData.amount || ''} />
                    </label>
                    <label>
                        <p>Currency:</p>
                        <select name="currency" onChange={handleChange} >
                            <option value="">--Please choose an option--</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </label>
                </fieldset>
                <button type="submit">Submit</button>
            </form>
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
        </div>
    );
}

export default Savings;