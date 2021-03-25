// src/components/Savings.tsx

import React from "react";
import axios from "axios";

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

    return (
        <ul className="savings">
            {savings.map((s) => (
                <li className="s" key={s.id}>
                    <p>{s.amount} {s.currency}</p>
                </li>
            ))}
        </ul>
    );
}

export default Savings;