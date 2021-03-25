// src/components/Savings.tsx

import React from "react";
import axios from "axios";

function BankAccounts() {
    const [bankAccounts, setBankAccounts] = React.useState<any[]>([])

    React.useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/bank-accounts")
            .then((response) => setBankAccounts(response.data));
    }, []);

    return (
        <ul className="bankAccounts">
            {Object.entries(bankAccounts).map(([key, value]) =>
                <li className="bankAccount" key={key}>
                    <h4>{value.name}</h4>
                    <p>{value.description}</p>
                </li>
            )}
        </ul>
    );
}

export default BankAccounts;