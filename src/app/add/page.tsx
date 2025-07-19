"use client";

import { useState, FormEvent } from "react";

export default function AddPage() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);

        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (isNaN(numA) || isNaN(numB)) {
            setError("Please enter valid numbers");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/add/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ a: numA, b: numB }),
            });
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const data = (await res.json()) as { result: number };
            setResult(data.result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        }
    };

    return (
        <div style={{ padding: "1rem", maxWidth: 400 }}>
            <h1>Add Two Numbers</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        a:
                        <input
                            type="number"
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            style={{ marginLeft: 8, width: "100%" }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        b:
                        <input
                            type="number"
                            value={b}
                            onChange={(e) => setB(e.target.value)}
                            style={{ marginLeft: 8, width: "100%" }}
                        />
                    </label>
                </div>
                <button type="submit">Calculate</button>
            </form>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {result !== null && (
                <p style={{ marginTop: 12 }}>
                    Result: <strong>{result}</strong>
                </p>
            )}
        </div>
    );
}
