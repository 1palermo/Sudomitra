import React, { useState } from 'react';
import axios from 'axios';

const MainContent = () => {
    const [image, setImage] = useState(null);
    const [inputBoard, setInputBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
    const [solvedBoard, setSolvedBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
    const [solved, setSolved] = useState(false);
    const [editing, setEditing] = useState(false);
    const [gridDetected, setGridDetected] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        
        setImage(URL.createObjectURL(file));
        processImage(formData);
    };

    const processImage = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setInputBoard(response.data.input_grid);
            setSolved(false);
            setGridDetected(true);
            setError('');
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image.');
        }
    };

    const handleInputChange = (rowIndex, colIndex, value) => {
        const newBoard = [...inputBoard];
        newBoard[rowIndex][colIndex] = value ? parseInt(value) : 0;
        setInputBoard(newBoard);
    };

    const handleEditClick = () => {
        setEditing(!editing);
    };

    const handleConfirmClick = async () => {
        try {
            const response = await axios.post('http://localhost:5000/solve', { input_grid: inputBoard });
            if (response.data.solved_grid) {
                setSolvedBoard(response.data.solved_grid);
                setSolved(true);
                setEditing(false);
                setError('');
            } else {
                setSolved(false);
                setError('Failed to solve Sudoku. Please check the input.');
            }
        } catch (error) {
            console.error('Error solving sudoku:', error);
            setError('Failed to solve Sudoku. Please try again.');
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
                </div>
            )}
            {gridDetected && (
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-4">Input Sudoku</h2>
                    <div className="grid grid-cols-9 gap-1 mb-4">
                        {inputBoard.map((row, rowIndex) => (
                            row.map((cell, colIndex) => (
                                <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8 flex items-center justify-center border border-gray-300">
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={cell || ''}
                                            onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                            className="w-full h-full text-center"
                                        />
                                    ) : (
                                        cell || '.'
                                    )}
                                </div>
                            ))
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            {editing ? 'Cancel' : 'Edit'}
                        </button>
                        <button
                            onClick={handleConfirmClick}
                            className="bg-green-500 text-white py-2 px-4 rounded"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
            {error && (
                <div className="mt-4 text-red-500">
                    {error}
                </div>
            )}
            {solved && (
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-4 mt-4">Solved Sudoku</h2>
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
