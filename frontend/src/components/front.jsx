import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

const SudokuSolver = () => {
    const [image, setImage] = useState(null);
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0))); // Example empty board
    const [solved, setSolved] = useState(false);
    const [ocrText, setOcrText] = useState('');

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
            console.log(text); // Output OCR text for debugging
            setOcrText(text); // Set OCR text to state for later use
        });
    };

    const solveSudoku = async () => {
        try {
            if (!ocrText) {
                alert('OCR text is empty. Please upload an image and try again.');
                return;
            }

            const response = await sendToOpenAI(ocrText);

            const solvedSudoku = response.data.choices[0].text.trim();

            if (isValidSudoku(solvedSudoku)) {
                updateBoard(solvedSudoku);
                setSolved(true);
            } else {
                console.error('Invalid Sudoku solution');
                alert('Failed to solve Sudoku puzzle.');
            }
        } catch (error) {
            console.error('Error solving Sudoku:', error);
            alert('Failed to solve Sudoku puzzle.');
        }
    };

    const sendToOpenAI = (ocrText) => {
        const apiKey = 'sK82300112488957'; 

        return axios.post(
            'https://api.ocr.space/parse/image',
            {
                prompt: ocrText,
                max_tokens: 150
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );
    };

    const isValidSudoku = (sudokuString) => {
        // Validate if the solved Sudoku string is a valid 81-character string
        return sudokuString.length === 81 && sudokuString.match(/^[1-9\.]+$/);
    };

    const updateBoard = (solvedSudoku) => {
        // Convert the solved Sudoku string into a 2D array (9x9 board)
        const newBoard = [];
        for (let i = 0; i < 9; i++) {
            newBoard.push(solvedSudoku.substring(i * 9, (i + 1) * 9).split('').map(Number));
        }
        setBoard(newBoard);
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
                    className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                    onClick={solveSudoku}
                >
                    Solve Sudoku
                </button>
                {solved && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4">Solved Sudoku</h2>
                        <div className="grid grid-cols-9 gap-1">
                            {board.map((row, rowIndex) => (
                                row.map((cell, colIndex) => (
                                    <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8 flex items-center justify-center border border-gray-300">
                                        {cell || '.'}
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-12 text-gray-700 mx-auto px-24">
                <h2 className="text-2xl font-semibold mb-4">About Sudomitra</h2>
                <p className="text-base mb-2">
                    Sudomitra is a powerful tool for solving Sudoku puzzles. Simply upload an image of the puzzle,
                    and it will be automatically solved using advanced algorithms. Whether you're stuck on a challenging
                    puzzle or just want to verify your solution, Sudomitra is here to assist you!
                </p>
                <p className="text-base">
                    Powered by cutting-edge image processing and AI techniques, Sudomitra ensures accurate and speedy
                    solutions to a wide range of Sudoku puzzles. Try it out today and never struggle with Sudoku again!
                </p>
            </div>
        </div>
    );
};

export default SudokuSolver;
