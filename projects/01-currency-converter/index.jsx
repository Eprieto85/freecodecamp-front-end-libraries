const { useState, useMemo } = React;

// Exchange rates relative to 1 USD (fixed demo rates)
const rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.7
};

const names = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen"
};

const currencies = Object.keys(rates);

function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  // Memoized: depends on amount and from, never on to.
  const convertedAmounts = useMemo(() => {
    const amountInUsd = Number(amount) / rates[from];
    return Object.fromEntries(
      currencies.map((code) => [code, (amountInUsd * rates[code]).toFixed(2)])
    );
  }, [amount, from]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <section className="card" id="converter">
      <div className="fields">
        <label>
          Amount
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {currencies.map((code) => (
              <option key={code} value={code}>{code} — {names[code]}</option>
            ))}
          </select>
        </label>
        <button className="swap" type="button" onClick={swap} aria-label="Swap currencies">⇄</button>
        <label>
          To
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {currencies.map((code) => (
              <option key={code} value={code}>{code} — {names[code]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="result">
        <span className="result-label">{amount || 0} {from} =</span>
        <p id="result">{convertedAmounts[to]} {to}</p>
      </div>

      <h2>Same amount in every currency</h2>
      <ul className="table">
        {currencies.map((code) => (
          <li key={code} className={code === to ? "active" : ""}>
            <span>{code}</span>
            <strong>{convertedAmounts[code]}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CurrencyConverter />);
