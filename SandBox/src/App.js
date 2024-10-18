import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function switchToPlayer() {
    const bestMove = findBestMove(currentSquares);
    if (xIsNext) {
      currentSquares[bestMove] = 'X';
    } else {
      currentSquares[bestMove] = 'O';
    }
    handlePlay(currentSquares);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/* Moves here */}</ol>
        <button onClick={switchToPlayer}>Switch to Player {xIsNext ? 'X' : 'O'}</button>
      </div>
    </div>
  );
}

function findBestMove(squares) {
  const moveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const squaresCopy = squares.slice();
      squaresCopy[i] = 'O';
      if (calculateWinner(squaresCopy) === 'O') {
        return i;
      }
    }
  }

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const squaresCopy = squares.slice();
      squaresCopy[i] = 'X';
      if (calculateWinner(squaresCopy) === 'X') {
        return i;
      }
    }
  }

  for (let i of moveOrder) {
    if (!squares[i]) {
      return i;
    }
  }
}

function calculateWinner(squares) {
  const re = /^(?:(?:...){0,2}([OX])\1\1|.{0,2}([OX])..\2..\2|([OX])...\3...\3|..([OX]).\4.\4)/g;
  const flattened = squares.join('').replace(null, '-');
  const match = re.exec(flattened);

  return match ? match[1] || match[2] || match[3] || match[4] : null;
}
