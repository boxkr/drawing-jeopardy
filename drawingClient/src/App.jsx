import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DrawingBoard from './DrawingBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <DrawingBoard/>
    </div>
  )
}

export default App
