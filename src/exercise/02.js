// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// eslint-disable-next-line no-unused-vars
function GreetingOld({initialName = ''}) {
  // Original version that doesn't do lazy initialisation
  // const [name, setName] = React.useState(
  //   window.localStorage.getItem('name') || initialName
  // )

  // could do it like this but isn't "typical"
  // function getInitValue() { blah }
  // const [name, setName] = React.useState(getInitValue) <-- note not invoking, just referencing

  const [name, setName] = React.useState(
    // localStorage.getItem() is a synchronous call
    // this moves it from render phase to lazy init phase only
    // note that function is defined on every render but that's cheap
    // Kent says he uses this around 2% of the time
    () => window.localStorage.getItem('name') || initialName,
  )

  // use anfn↵

  // this is called "for every update of the component and for the initial render"
  // but is also called for other reasons i.e. parent component is being re-rendered
  // re-rendering (no deps array) sometimes might cause performance issues, but it shouldn't cause bugs
  // deps array can and should include functions as well
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name]) // for EC2 added in dependency on `name`, note this is a SHALLOW COMPARE only

  // You can use [] to get it to run only once, but this is considered bad practice
  // there are es-lint checks for it now

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
const useLocalStorageStateOld = (key, initialValue = '') => {
  const [value, setValue] = React.useState(
    () => window.localStorage.getItem(key) || initialValue,
  )
  React.useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [key, value])
  return [value, setValue]
}

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialise = JSON.stringify, deserialise = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialise(valueInLocalStorage)
    }
    // same pattern as useState: let them pass in a function for computationally heavy stuff
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current // retrieve old value
    if (prevKey !== key) {
      // key has changed; clean up old
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key // update ref value every time
    window.localStorage.setItem(key, serialise(value))
  }, [key, serialise, value])
  return [value, setValue]
}

// eslint-disable-next-line no-unused-vars
const useLocalStorageStateMine = (key, initialValue) => {
  const getValue = key => {
    let value = window.localStorage.getItem(key)
    // a lot of the below is just unnecessary I think?
    try {
      value = JSON.parse(value)
    } catch (error) {
      // do nothing
    }
    return value
  }
  const [value, setValue] = React.useState(() => getValue(key) || initialValue)
  React.useEffect(() => {
    // also unnecessary?
    const coercedValue =
      typeof value === 'object' ? JSON.stringify(value) : value
    // console.log(key, value, coercedValue);
    window.localStorage.setItem(key, coercedValue)
  }, [key, value])
  return [value, setValue]
}

const words = [
  'ducky',
  'world',
  'beetle',
  'forest',
  'chainsaw',
  'ladies',
  'chicken',
]

const randomWord = () => words[Math.floor(Math.random() * words.length)]

// use nfn↵
const Greeting = ({initialName = ''}) => {
  const [name, setName] = useLocalStorageState('name', initialName)
  const [number, setNumber] = useLocalStorageState('number', 2312)
  const [obj, setObj] = useLocalStorageState('obj', {hello: 'world'})
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={e => setName(e.target.value)} id="name" />
        <input
          value={number}
          onClick={e => setNumber(Math.ceil(Math.random() * 1000))}
          id="number"
          type="button"
        />
        <input
          value={obj.hello}
          onClick={e => setObj({hello: randomWord()})}
          id="obj"
          type="button"
        />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

/*
  A custom hook isn't a React hook because it's named with "use" prefix, it's because it
  *uses* hooks (i.e. useState, useEffect) in it. And therefore must be named appropriately.
*/
export default App

/*

Compare to ../final/02.extra-4.js
He includes some more error-handling etc.

> typeof(JSON.parse('4'))
  "number"
> typeof(JSON.parse('{"foo": "bar"}'))
  "object"
> typeof(JSON.parse('true'))
  "boolean"
> typeof(JSON.parse('what'))
  VM10913:1 Uncaught SyntaxError: Unexpected token w in JSON at position 0
    at JSON.parse (<anonymous>)
    at <anonymous>:1:13
> typeof(JSON.parse('\"what\"'))
  "string"

useEffect(() => {})      // we depend on EVERYTHING
useEffect(() => {}, [])  // we depend on NOTHING (run first time only)
useEffect(() => {}, [x]) // we depend on x

For updates, if the effect will need to be run again, any cleanup work is done first
For unmounts, all cleanup effects are run

{showChild ? <Child /> : null}
<Child/> is the same as React.createElement(Child)
So it hasn't called function, it just knows it.
React will call function (render component) when time is right.

Components can be in different parts of the lifecycle at same time
i.e. parent in UPDATE and child in MOUNT

*/
