// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

// He demo'd doing initial array this way... I guess it works fine
// because the original Array is always copied and mutated when
// user selects a square. So the empty board can stay around. (Can I do a freeze() on arrays?)
// eslint-disable-next-line no-unused-vars
const initialSquares = Array(9).fill(null)

// eslint-disable-next-line no-unused-vars
function Board() {
  const [squares, setSquares] = React.useState(() => {
    const savedBoard = window.localStorage.getItem('squares')
    return savedBoard ? JSON.parse(savedBoard) : blankBoard()
    /* His quick version was just this:
      () => JSON.parse(window.localStorage.getItem('squares')) || Array(9).fill(null) */
  })

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function saveBoard(squares) {
    window.localStorage.setItem('squares', JSON.stringify(squares))
    setSquares(squares)
  }

  // square is the index
  //  [0, 1, 2
  //   3, 4, 5,
  //   6, 7, 8]
  function selectSquare(square) {
    if (squares[square]) return // this square has already been selected - disallow move
    if (winner) return // game has already been won - disallow move

    const squaresCopy = [...squares] // should never mutate managed state (for objects/arrays etc.)
    squaresCopy[square] = nextValue

    saveBoard(squaresCopy)
  }

  function restart() {
    setSquares(blankBoard())
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function BoardEc2() {
  const [squares, setSquares] = useLocalStorageState('squares', () =>
    Array(9).fill(null), // He doesn't return the anon function, he just sets it directly to filled array. I guess it's not a very intensive operation.
  )

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(Array(9).fill(null))
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <BoardEc2 />
      </div>
    </div>
  )
}

function BoardEc3({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function GameEc3() {
  // he named this "history" instead of "moves"
  const [moves, setMoves] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])
  const [step, setStep] = useLocalStorageState('tic-tac-toe:step', 0)

  const currentSquares = moves[step] // this is the critical line!

  const nextValue = calculateNextValue(currentSquares) // X or O
  const winner = calculateWinner(currentSquares) // X or O or null
  const status = calculateStatus(winner, currentSquares, nextValue) // status string

  function restart() {
    setMoves([Array(9).fill(null)])
    setStep(0)
  }

  function onSelectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }
    const currentSquaresCopy = [...currentSquares]
    currentSquaresCopy[square] = nextValue
    setCurrentSquares(currentSquaresCopy, moves, step)
  }

  function setCurrentSquares(squares, moves, step) {
    const nextStep = step + 1
    const movesCopy = moves.slice(0, nextStep); // new array with shallow copy (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
    // const movesCopy = Array(nextStep).fill(null)
    // for (let i = 0; i < nextStep; i++) {
    //   movesCopy[i] = [...moves[i]]
    // }
    // movesCopy[nextStep] = squares
    // setMoves(movesCopy)
    // setStep(step => nextStep)
    
    // because we're in an event-handler (onSelectSquare)
    // these state updates are batched together after we finish
    setMoves([...movesCopy, squares])
    setStep(movesCopy.length)
  }

  function GameButton({moveNum, onClick}) {
    // I had to change this all around because the tests were failing. :'(

    // const props = moveNum === step ? {disabled: true} : {}
    const isCurrent = moveNum === step;
    return (
      // <button {...props} onClick={onClick}>
      <button disabled={isCurrent} onClick={onClick}>
        Go to {moveNum === 0 ? `game start` : `move #${moveNum}`}
        {moveNum === step && ` (current)`}
      </button>
    )
  }
  
  // Note you can do do conditions and render nothing in JSX like this:
  // {blahIsTrue ? "blah" : null}

  return (
    <div className="game">
      <div className="game-board">
        <BoardEc3 onClick={onSelectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {moves.map((_, i) => (
            <li key={i}>
              <GameButton moveNum={i} onClick={() => setStep(i)} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

export function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export const blankBoard = () => Array(9).fill(null)

export default function App() {
  return <GameEc3 />
}

export function AppEc1() {
  return <Game />
}
