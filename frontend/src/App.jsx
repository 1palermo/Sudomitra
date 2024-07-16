import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainContent from './components/MainContent'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
            <Header />
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                Upload an image of a Sudoku puzzle, and our solver will automatically solve it for you.
                Leverage the power of advanced algorithms to crack even the most challenging puzzles!
            </p>
            <MainContent />
            <Footer />
      </div>
    </>
  )
}

export default App
