import {
  Box,
  Button,
} from '@material-ui/core';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';

let code = '';
let name = '';
let description = '';
let savingspot = '';
let errorMessage = '';

function handleSubmit(callback) {
  axios.post('http://127.0.0.1:5000/bank-accounts', {
    code,
    name,
    description,
    savings_pot: savingspot
  }).then((response) => {
    console.log(response);
    callback();
  }).catch((error) => {
    console.log(error);
    errorMessage = 'An error occured';
    console.log(errorMessage);
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
            <div className="errorBlock">
              {errorMessage
                && <h3 className="error">{errorMessage}</h3>}
            </div>
            <div className="content">
              <form>
                <label htmlFor="code">
                  <p>Code</p>
                  <input id="code" name="code" onChange={handleChange} />
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
