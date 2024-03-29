import {
  Box,
  Button,
} from '@material-ui/core';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import config from '../../config/default.json';

const savingsTrackerApi = config.savingsTrackerUrl;

let code = '';
let name = '';
let description = '';
let savingspot = '';

function handleSubmit(callback) {
  axios.post(`${savingsTrackerApi}/bank-accounts`, {
    code,
    name,
    description,
    savings_pot: savingspot
  }, { adapter }).then((response) => {
    console.log(response);
    callback();
    window.location.reload();
  }).catch((error) => {
    console.log(error);
  });
}

function handleChange(event) {
  if (event.target.name === 'code') {
    code = event.target.value;
  }
  if (event.target.name === 'name') {
    name = event.target.value;
  }
  if (event.target.name === 'description') {
    description = event.target.value;
  }
  if (event.target.name === 'savingspot') {
    savingspot = event.target.value;
  }
}

const BankAccountListToolbar = (props) => (
  <Box {...props}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Popup
        trigger={<Button color="primary" variant="contained">Add bank account</Button>}
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <button type="button" className="close" onClick={close}>
              &times;
            </button>
            <div className="header">New bank account</div>
            <div className="content">
              <form>
                <label htmlFor="code">
                  <p>Code</p>
                  <input id="code" name="code" onChange={handleChange} maxLength="3" />
                </label>
                <label htmlFor="name">
                  <p>Name</p>
                  <input id="name" name="name" onChange={handleChange} />
                </label>
                <label htmlFor="description">
                  <p>Description</p>
                  <input id="description" name="description" onChange={handleChange} />
                </label>
                <label htmlFor="savingspot">
                  <p>Savings Pot</p>
                  <input id="savingspot" name="savingspot" onChange={handleChange} />
                </label>
                <br />
                <br />
                <div className="actions">
                  <Button className="submit" color="primary" variant="contained" onClick={() => { handleSubmit(close); }}>
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

export default BankAccountListToolbar;
