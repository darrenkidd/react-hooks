// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt'

/* IMPORTANT IMPORTANT IMPORTANT

      "Remember that when you do: <div>hi</div> that’s actually syntactic sugar
      for a React.createElement so you don’t actually have access to DOM nodes
      in your render method. In fact, DOM nodes aren’t created at all until the
      ReactDOM.render method is called. Your component’s render method is really
      just responsible for creating and returning React Elements and has nothing
      to do with the DOM in particular."

      "So to get access to the DOM, you need to ask React to give you access to
      a particular DOM node when it renders your component. The way this happens
      is through a special prop called ref."
      
      useEffect() is called after everything is mounted, so you should have
      access to the DOM nodes by then. "So often you’ll do direct DOM
      interactions/manipulations in the useEffect callback."

*/

function Tilt({children}) {
  const tiltRef = React.useRef()

  React.useEffect(() => {
    const tiltNode = tiltRef.current
    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    })
    return () => tiltNode.vanillaTilt.destroy()
  }, []) // "we know that the tilt node will never change"
  // This is because we only care about when it's mounted and unmounted;
  // we never have any "state" change which requires us to re-run this setup.

  // Changing state will trigger a re-render, but changing a ref won't, because
  // it's hidden behind the current prop. So useful not just for DOM interaction.

  return (
    <div className="tilt-root" ref={tiltRef}>
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

export default App
