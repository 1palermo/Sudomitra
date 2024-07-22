/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import SpiralCanvas from './components/LandingPage/Spiral';
import backgroundImage from './assets/7971.jpg'; // Adjust the path as needed

const App = () => {
  const [showSpiral, setShowSpiral] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpiral(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <>
      {showSpiral ? (
        <div
          className="min-h-screen flex flex-col items-center justify-center py-10"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'repeat' }}
        >
          <SpiralCanvas />
        </div>
      ) : (
        <div
          className="min-h-screen flex flex-col items-center justify-center py-10"
          style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'repeat' }}
        >
          <Header />
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Upload an image of a Sudoku puzzle, and our solver will automatically solve it for you.
            Leverage the power of advanced algorithms to crack even the most challenging puzzles!
          </p>
          <MainContent />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
