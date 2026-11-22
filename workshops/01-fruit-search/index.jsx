const { useState, useEffect } = React;

// Used only if the freeCodeCamp API cannot be reached.
const localFruits = [
  "Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry",
  "Coconut", "Grape", "Guava", "Kiwi", "Lemon", "Lime", "Mango", "Melon",
  "Orange", "Papaya", "Peach", "Pear", "Pineapple", "Plum", "Raspberry", "Strawberry"
];

function FruitsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
  }

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://fruit-search.freecodecamp.rocks/api/fruits?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.map((fruit) => fruit.name));
      } catch (error) {
        // Fallback: filter a local list so the demo always works
        const q = query.trim().toLowerCase();
        setResults(localFruits.filter((name) => name.toLowerCase().includes(q)));
      } finally {
        setSearching(false);
      }
    }, 700);

    // Cleanup: cancel the pending search when the query changes again
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div id="search-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="search-input">Search for fruits:</label>
        <input
          id="search-input"
          type="search"
          placeholder="Try “ap” or “berry”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <p className="status">
        {searching ? "Searching…" : query.trim() === "" ? "Start typing to search." : `${results.length} result(s)`}
      </p>

      <div id="results">
        {results.length > 0 ? (
          results.map((item) => (
            <p key={item} className="result-item">{item}</p>
          ))
        ) : (
          !searching && query.trim() !== "" && <p className="empty">No results found</p>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FruitsSearch />);
