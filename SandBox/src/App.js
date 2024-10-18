import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, size }) {
  function handleClick(i) {
    if (calculateWinner(squares, size) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, size);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const rows = [];
  for (let row = 0; row < size; row++) {
    const cols = [];
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      cols.push(
        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
      );
    }
    rows.push(<div key={row} className="board-row">{cols}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [size, setSize] = useState(3);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function handleResize(newSize) {
    const newBoard = Array(newSize * newSize).fill(null);
    
    // Copy the old board into the new board as much as possible
    const minSize = Math.min(size, newSize);
    for (let row = 0; row < minSize; row++) {
      for (let col = 0; col < minSize; col++) {
        const oldIndex = row * size + col;
        const newIndex = row * newSize + col;
        newBoard[newIndex] = currentSquares[oldIndex];
      }
    }

    setHistory([newBoard]);
    setCurrentMove(0);
    setSize(newSize);
    setXIsNext(true);
  }

  return (
    <div className="game">
      <div className="game-board">
        <label>
          Board Size: 
          <input 
            type="number" 
            min="3" 
            max="10" 
            value={size} 
            onChange={(e) => handleResize(Number(e.target.value))} 
          />
        </label>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} size={size} />
      </div>
      <div className="game-info">
        <ol>{/* Moves here */}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, size) {
  const lines = [];

  // Add horizontal win conditions
  for (let row = 0; row < size; row++) {
    const line = [];
    for (let col = 0; col < size; col++) {
      line.push(row * size + col);
    }
    lines.push(line);
  }

  // Add vertical win conditions
  for (let col = 0; col < size; col++) {
    const line = [];
    for (let row = 0; row < size; row++) {
      line.push(row * size + col);
    }
    lines.push(line);
  }

  // Add diagonal win conditions
  const diag1 = [], diag2 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * size + i);
    diag2.push(i * size + (size - i - 1));
  }
  lines.push(diag1, diag2);

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
