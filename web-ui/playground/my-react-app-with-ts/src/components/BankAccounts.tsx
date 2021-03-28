// src/components/BankAccounts.tsx

import { useReducer, useState, useEffect } from 'react';
import axios from "axios";


const formReducer = function (state: any, event: any) {
    if (event.reset) {
        return {
            name: '',
            description: '',
            code: ''
        }
    }
    return {
        ...state,
        [event.name]: event.value
    }
}

function BankAccounts() {
    const [bankAccounts, setBankAccounts] = useState<any[]>([])

    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState<boolean>(false);
    const handleSubmit = function (event: any) {
        event.preventDefault();
        setSubmitting(true);

        axios.post("http://127.0.0.1:5000/bank-accounts", {
            code: formData['code'],
            name: formData['name'],
            description: formData['description']
        }).then(function (response) {
            axios
                .get("http://127.0.0.1:5000/bank-accounts")
                .then((response) => setBankAccounts(response.data));
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
            .get("http://127.0.0.1:5000/bank-accounts")
            .then((response) => setBankAccounts(response.data));
    }, []);

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
                        <p>Code</p>
                        <input name="code" onChange={handleChange} value={formData.code || ''} />
                    </label>
                    <label>
                        <p>Name</p>
                        <input name="name" onChange={handleChange} value={formData.name || ''} />
                    </label>
                    <label>
                        <p>Description</p>
                        <input name="description" onChange={handleChange} value={formData.description || ''} />
                    </label>
                </fieldset>
                <button type="submit">Submit</button>
            </form>
            <ul className="bankAccounts">
                {Object.entries(bankAccounts).map(([key, value]) =>
                    <li className="bankAccount" key={key}>
                        {value.name} ({key})
                </li>
                )}
            </ul >
        </div>
    );
}

export default BankAccounts;