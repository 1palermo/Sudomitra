import React, { useState } from 'react';

const SudokuSolver = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        // Process the uploaded image here
        setImage(URL.createObjectURL(file));
    };

    const solveSudoku = () => {
        // Implement the Sudoku solving logic here
        // You can use existing Sudoku solving algorithms or libraries
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Sudomitra</h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                Upload an image of a Sudoku puzzle, and our solver will automatically solve it for you. 
                Leverage the power of advanced algorithms to crack even the most challenging puzzles!
            </p>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-green-700 hover:file:bg-blue-100"
                />
                {image && (
                    <div className="mt-4">
                        <img src={image} alt="Sudoku Puzzle" className="w-full h-auto rounded-lg" />
                    </div>
                )}
                <button 
                    onClick={solveSudoku} 
                    className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Solve Sudoku
                </button>
            </div>
            <div className="mt-12 text-gray-700 mx-auto p-24">
                <h2 className="text-2xl font-semibold mb-4">About Sudoku Solver</h2>
                <p className="text-base mb-2">
                    Sudoku is a popular puzzle that requires logical thinking and patience. Our Sudoku Solver app
                    makes it easy to solve any Sudoku puzzle by simply uploading an image. Whether you're stuck on a
                    tricky puzzle or just want to check your solution, our app is here to help!
                </p>
                <p className="text-base">
                    Powered by advanced image processing and algorithmic techniques, the Sudoku Solver app is designed
                    to handle a wide range of Sudoku puzzles with accuracy and speed. Try it out and never get stuck
                    on a Sudoku puzzle again!
                </p>
            </div>
        </div>
    );
};

export default SudokuSolver;
