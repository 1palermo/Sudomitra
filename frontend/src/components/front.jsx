import React, { useState } from 'react';
import axios from 'axios';

const SudokuSolver = () => {
    const [image, setImage] = useState(null);
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
    const [solved, setSolved] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        
        setImage(URL.createObjectURL(file));
        console.log("Selected Image: ", file);  // Debugging log
        processImage(formData);
    };

    const processImage = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("OCR Response: ", response.data);  // Debugging log
            setBoard(response.data);
            setSolved(true);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image.');
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
