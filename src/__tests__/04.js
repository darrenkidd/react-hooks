import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import App from '../final/04'
import App, {
  blankBoard,
  calculateNextValue,
  calculateStatus,
  calculateWinner,
} from '../exercise/04'

test('can play a game of tic tac toe', () => {
  render(<App />)
  // prettier-ignore
  const [
    s1, s2, s3,
    s4, s5, s6,
    s7, s8, s9 // eslint-disable-line no-unused-vars
  ] = Array.from(screen.queryAllByRole('button'))
  expect(screen.getByText('Next player: X')).toBeInTheDocument()

  userEvent.click(s1)
  expect(s1).toHaveTextContent('X')

  expect(screen.getByText('Next player: O')).toBeInTheDocument()
  userEvent.click(s5)
  expect(s5).toHaveTextContent('O')

  expect(screen.getByText('Next player: X')).toBeInTheDocument()
  userEvent.click(s9)
  expect(s9).toHaveTextContent('X')

  expect(screen.getByText('Next player: O')).toBeInTheDocument()
  userEvent.click(s7)
  expect(s7).toHaveTextContent('O')

  expect(screen.getByText('Next player: X')).toBeInTheDocument()
  userEvent.click(s3)
  expect(s3).toHaveTextContent('X')

  expect(screen.getByText('Next player: O')).toBeInTheDocument()
  userEvent.click(s2)
  expect(s2).toHaveTextContent('O')

  expect(screen.getByText('Next player: X')).toBeInTheDocument()
  userEvent.click(s6)
  expect(s6).toHaveTextContent('X')

  // game is over so no more moves may be played
  expect(screen.getByText('Winner: X')).toBeInTheDocument()
  userEvent.click(s4)
  expect(s4).toHaveTextContent('')
})

test('does not change square value when it is clicked multiple times', () => {
  render(<App />)
  const [square1] = Array.from(screen.queryAllByRole('button'))

  userEvent.click(square1)
  userEvent.click(square1)
  expect(square1).toHaveTextContent('X')
})

test('should calculate next value correctly', () => {
  // zero/even moves --> X
  // odd moves --> O

  // prettier-ignore
  expect(calculateNextValue([
    null, null, null,
    null, null, null,
    null, null, null,
  ])).toBe('X') // 0

  // prettier-ignore
  expect(calculateNextValue([
     'X',  'O',  'X',
    null,  'O',  'X',
     'O', null,  'X',
  ])).toBe('O') // 7

  // prettier-ignore
  expect(calculateNextValue([
     'X',  'O',  'X',
     'X',  'O',  'X',
     'O', null,  'O',
  ])).toBe('X') // 8
})

test('should calculate status correctly', () => {
  expect(calculateStatus('X', [], '')).toBe('Winner: X')
  // prettier-ignore
  expect(calculateStatus('', [
    'X', 'O', 'X',
    'X', 'O', 'X',
    'O', 'X', 'O',
  ], '')).toBe(`Scratch: Cat's game`)
  expect(calculateStatus('', blankBoard(), 'X')).toBe('Next player: X')
})

// test↵
test('should calculate winner correctly', () => {
  // prettier-ignore
  expect(calculateWinner([
     'X', null, null,
     'X', null, null,
     'X', null, null,
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
    null,  'X', null,
    null,  'X', null,
    null,  'X', null,
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
    null, null,  'X',
    null, null,  'X',
    null, null,  'X',
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
     'X',  'X',  'X',
    null, null, null,
    null, null, null,
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
    null, null, null,
    'X',  'X',  'X',
    null, null, null,
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
    null, null, null,
    null, null, null,
    'X',  'X',  'X',
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
    null, null, 'X',
    null, 'X', null,
    'X', null, null,
  ])).toBe('X')
  // prettier-ignore
  expect(calculateWinner([
    'X', null, null,
    null, 'X', null,
    null, null, 'X',
  ])).toBe('X')
})

test('should calculate not-yet-won games as no winner', () => {
  // prettier-ignore
  expect(calculateWinner([
    'O', 'O', null,
    null, 'X', null,
    null, null, 'X',
  ])).toBeNull()
  // prettier-ignore
  expect(calculateWinner([
    'X', 'O', null,
    null, 'X', 'O',
    null, null, 'O',
  ])).toBeNull()
})
