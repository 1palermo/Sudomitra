// MainContent.js
import React, { useState } from 'react';
import axios from 'axios';

const MainContent = () => {
    const [image, setImage] = useState(null);
    const [inputBoard, setInputBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
    const [solvedBoard, setSolvedBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
    const [solved, setSolved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file));
    };

    const processImage = async () => {
        if (!image) {
            alert('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setInputBoard(response.data.input_grid);
            setSolvedBoard(response.data.solved_grid);
            setSolved(true);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {image && (
                <div className="mt-4">
                    <img src={image} alt="Sudoku Puzzle" className="w-full h-auto rounded-lg" />
                    <button
                        onClick={processImage}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        {loading ? 'Processing...' : 'Get Result'}
                    </button>
                </div>
            )}
            {solved && (
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-4">Input Sudoku</h2>
                    <div className="grid grid-cols-9 gap-1 mb-4">
                        {inputBoard.map((row, rowIndex) => (
                            row.map((cell, colIndex) => (
                                <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8 flex items-center justify-center border border-gray-300">
                                    {cell || '.'}
                                </div>
                            ))
                        ))}
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Solved Sudoku</h2>
                    <div className="grid grid-cols-9 gap-1">
                        {solvedBoard.map((row, rowIndex) => (
                            row.map((cell, colIndex) => (
                                <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8 flex items-center justify-center border border-gray-300">
                                    {cell}
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default MainContent;