import {
  Box,
  Button,
} from '@material-ui/core';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

let amount = 0;
let currency = '';
let transferdate = '';
let srcaccount = '';
let destaccount = '';

function handleSubmit() {
  axios.post('http://127.0.0.1:5000/savings', {
    transfer_date: transferdate,
    amount,
    currency,
    src_account: srcaccount,
    dest_account: destaccount
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });
}

function handleChange(event) {
  if (!event.target) {
    transferdate = event;
  } else {
    if (event.target.name === 'amount') {
      amount = event.target.value;
    }
    if (event.target.name === 'currency') {
      currency = event.target.value;
    }
    if (event.target.name === 'srcaccount') {
      srcaccount = event.target.value;
    }
    if (event.target.name === 'destaccount') {
      destaccount = event.target.value;
    }
  }
}

const SavingsListToolbar = (props) => {
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

  return (
    <Box {...props}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Popup
          trigger={<Button color="primary" variant="contained">Add savings</Button>}
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <button type="button" className="close" onClick={close}>
                &times;
              </button>
              <div className="header">New savings</div>
              <div className="content">
                <form>
                  <label htmlFor="srcaccount">
                    <p>Source Bank Account:</p>
                    <select id="srcaccount" name="srcaccount" onChange={handleChange}>
                      <option value="">--Please choose an option--</option>
                      {bankAccounts.map((bankAccount) => (
                        <option value={bankAccount.code}>{bankAccount.name}</option>
                      ))}
                    </select>
                  </label>
                  <label htmlFor="destaccount">
                    <p>Destination Bank Account:</p>
                    <select id="destaccount" name="destaccount" onChange={handleChange}>
                      <option value="">--Please choose an option--</option>
                      {bankAccounts.map((bankAccount) => (
                        <option value={bankAccount.code}>{bankAccount.name}</option>
                      ))}
                    </select>
                  </label>
                  <label htmlFor="transferdate">
                    <p>Transfer Date</p>
                    <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */}</>
                    <DatePicker selected={transferdate} onChange={handleChange} />
                  </label>
                  <label htmlFor="amount">
                    <p>Amount</p>
                    <input id="amount" name="amount" onChange={handleChange} />
                  </label>
                  <label htmlFor="currency">
                    <p>Currency</p>
                    <select id="currency" name="currency" onChange={handleChange}>
                      <option value="">--Please choose an option--</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </label>
                  <br />
                  <br />
                  <div className="actions">
                    <Button className="submit" color="primary" variant="contained" onClick={() => { handleSubmit(); close(); }}>
                      Submit
                    </Button>
                    <Button className="button" onClick={() => { console.log('modal closed '); close(); }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Popup>
      </Box>
    </Box>
  );
};

export default SavingsListToolbar;
