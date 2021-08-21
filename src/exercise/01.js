// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function Greeting({initialName = ""}) {
  const [name, setName] = React.useState(initialName); // an invoke of setState() lets us notify React that it needs to re-render

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

function App() {
  return <><Greeting /><Greeting initialName="Darren" /></>
}
// if you forget to pass initialName as a prop then you get a nasty warning:
//   Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the
//   value changing from undefined to a defined value, which should not happen. Decide between using a
//   controlled or uncontrolled input element for the lifetime of the component.
//   More info: https://reactjs.org/link/controlled-components
// so we need to make sure that it always has a value
// easiest way is to give it a default value in the destructered function args


export default App
