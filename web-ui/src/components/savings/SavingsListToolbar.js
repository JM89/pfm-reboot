import {
  Box,
  Button,
} from '@material-ui/core';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

let code = '';
let name = '';
let description = '';

function handleSubmit() {
  console.log(code);
  console.log(name);
  console.log(description);
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
}

const SavingsListToolbar = (props) => (
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

export default SavingsListToolbar;
