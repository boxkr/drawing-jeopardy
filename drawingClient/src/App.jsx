import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'
import PlayerList from './PlayerList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <DrawingBoard/>
      <PlayerList/>
    </div>
  )
}

export default App
