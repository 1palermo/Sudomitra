import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SudokuSolver from './components/front'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SudokuSolver/>
    </>
  )
}

export default App
