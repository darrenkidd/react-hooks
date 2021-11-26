import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../exercise/04-classes'

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
  const {rerender} = render(<App />)
  const [square1] = Array.from(screen.queryAllByRole('button'))

  userEvent.click(square1)
  userEvent.click(square1)
  expect(square1).toHaveTextContent('X')
})

afterEach(() => {
  window.localStorage.removeItem('squares')
})

test('it writes the game to localStorage', () => {
  render(<App />)

  // prettier-ignore
  const [
    s1, s2, s3,
    s4, s5, s6,
    s7, s8, s9 // eslint-disable-line no-unused-vars
  ] = Array.from(screen.queryAllByRole('button'))

  userEvent.click(s1)
  userEvent.click(s2)

  const lsSquares1 = JSON.parse(window.localStorage.getItem('squares'))
  // prettier-ignore
  expect(lsSquares1).toStrictEqual([
     'X',  'O', null,
    null, null, null,
    null, null, null,
  ])
})

test('it reads saved games from localStorage', () => {
  // prettier-ignore
  window.localStorage.setItem('squares', JSON.stringify([
    null, null, null,
    null,  'X', null,
    'O', null,  'X',
  ]))

  render(<App />)

  // prettier-ignore
  const [
    s1, s2, s3,
    s4, s5, s6,
    s7, s8, s9 // eslint-disable-line no-unused-vars
  ] = Array.from(screen.queryAllByRole('button'))

  expect(s1).toBeEmptyDOMElement()
  expect(s2).toBeEmptyDOMElement()
  expect(s3).toBeEmptyDOMElement()
  expect(s4).toBeEmptyDOMElement()
  expect(s5).toHaveTextContent('X')
  expect(s6).toBeEmptyDOMElement()
  expect(s7).toHaveTextContent('O')
  expect(s8).toBeEmptyDOMElement()
  expect(s9).toHaveTextContent('X')
})
