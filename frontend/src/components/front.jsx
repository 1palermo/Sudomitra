import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const SudokuSolver = () => {
    const [image, setImage] = useState(null);
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0))); // Example empty board
    const [solved, setSolved] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file));
        processImage(file);
    };

    const processImage = (file) => {
        Tesseract.recognize(
            file,
            'eng',
            {
                logger: (m) => console.log(m),
            }
        ).then(({ data: { text } }) => {
            const extractedBoard = parseSudokuText(text);
            setBoard(extractedBoard);
        });
    };

    const parseSudokuText = (text) => {
        const rows = text.trim().split('\n');
        const board = Array(9).fill().map(() => Array(9).fill(0));

        rows.forEach((row, i) => {
            const digits = row.replace(/[^0-9]/g, '');
            digits.split('').forEach((digit, j) => {
                board[i][j] = parseInt(digit, 10);
            });
        });

        return board;
    };

    const isValid = (board, row, col, num) => {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num || 
                board[Math.floor(row / 3) * 3 + Math.floor(x / 3)][Math.floor(col / 3) * 3 + x % 3] === num) {
                return false;
            }
        }
        return true;
    };

    const solveSudokuUtil = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudokuUtil(board)) {
                                return true;
                            } else {
                                board[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const solveSudoku = () => {
        let newBoard = JSON.parse(JSON.stringify(board)); // Deep copy the board
        if (solveSudokuUtil(newBoard)) {
            setBoard(newBoard);
            setSolved(true);
        } else {
            alert("No solution exists for the given Sudoku puzzle.");
        }
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
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
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
                {solved && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4">Solved Sudoku</h2>
                        <div className="grid grid-cols-9 gap-1">
                            {board.flat().map((num, idx) => (
                                <div key={idx} className="w-8 h-8 flex items-center justify-center border border-gray-300">
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-12 text-gray-700 mx-auto px-24">
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
