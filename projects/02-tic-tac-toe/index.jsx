const { useState } = React;

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Returns { player, line } for the winner, or null.
function calculateWinner(squares) {
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

function Board() {
  EP.useLang(); // re-render when the language tab changes
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const result = calculateWinner(squares);
  const isDraw = !result && squares.every((square) => square !== null);

  function handleClick(index) {
    if (squares[index] || result) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // Update the scoreboard when this move ends the game
    const nextResult = calculateWinner(nextSquares);
    if (nextResult) {
      setScore((s) => ({ ...s, [nextResult.player]: s[nextResult.player] + 1 }));
    } else if (nextSquares.every((square) => square !== null)) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    }
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let status = EP.t("next") + (xIsNext ? "X" : "O");
  if (result) status = EP.t("winner") + result.player;
  else if (isDraw) status = EP.t("draw");

  return (
    <section className="game">
      <div className="scoreboard">
        <div className="score x"><span>{EP.t("player_x")}</span><strong>{score.X}</strong></div>
        <div className="score"><span>{EP.t("draws")}</span><strong>{score.draws}</strong></div>
        <div className="score o"><span>{EP.t("player_o")}</span><strong>{score.O}</strong></div>
      </div>

      <p id="status" className={result || isDraw ? "status done" : "status"}>{status}</p>

      <div className="board">
        {squares.map((value, index) => {
          const winning = result && result.line.includes(index);
          return (
            <button
              key={index}
              className={"square" + (value ? " " + value.toLowerCase() : "") + (winning ? " win" : "")}
              onClick={() => handleClick(index)}
              aria-label={EP.t("square") + (index + 1)}
            >
              {value}
            </button>
          );
        })}
      </div>

      <button id="reset" onClick={handleReset}>{EP.t("reset")}</button>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Board />);
