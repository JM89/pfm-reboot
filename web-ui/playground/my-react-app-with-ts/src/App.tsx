import React from 'react';
import './App.css';
import Savings from "./components/Savings";
import BankAccounts from "./components/BankAccounts";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Saving Tracker</h1>
      </header>
      <h2>Banks</h2>
      <BankAccounts />
      <h2>Savings</h2>
      <Savings />
    </div>
  );
}

export default App;
