from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])

def decode_image(image_data):
    try:
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        return np.array(image)
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def solve_sudoku(board):
    def is_valid(board, row, col, num):
        for i in range(9):
            if board[row][i] == num or board[i][col] == num:
                return False
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(3):
            for j in range(3):
                if board[start_row + i][start_col + j] == num:
                    return False
        return True

    def solve(board):
        for row in range(9):
            for col in range(9):
                if board[row][col] == 0:
                    for num in range(1, 10):
                        if is_valid(board, row, col, num):
                            board[row][col] = num
                            if solve(board):
                                return True
                            board[row][col] = 0
                    return False
        return True

    board_copy = [row[:] for row in board]
    if solve(board_copy):
        return board_copy
    else:
        return None

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        image_file = request.files['image']
        image_data = image_file.read()
        image = decode_image(image_data)
        if image is None:
            return jsonify({"error": "Failed to decode image"}), 400
        
        # Perform OCR on the image with bounding boxes
        results = reader.readtext(image)
        
        # Initialize an empty 9x9 grid with zeros
        sudoku_grid = [[0 for _ in range(9)] for _ in range(9)]

        # Function to map OCR results to the grid using bounding boxes
        def map_results_to_grid(results):
            # Define grid dimensions and cell size
            grid_size = 9
            image_height, image_width = image.shape[:2]
            cell_width = image_width / grid_size
            cell_height = image_height / grid_size

            for result in results:
                bbox, text, _ = result
                if text.isdigit():
                    # Calculate the center of the bounding box
                    x_center = (bbox[0][0] + bbox[2][0]) / 2
                    y_center = (bbox[0][1] + bbox[2][1]) / 2

                    # Determine the grid cell based on the center of the bounding box
                    row = int(y_center // cell_height)
                    col = int(x_center // cell_width)

                    # Place the digit in the grid cell
                    sudoku_grid[row][col] = int(text)

        # Map the OCR results to the Sudoku grid
        map_results_to_grid(results)

        # Solve the Sudoku puzzle
        solved_sudoku_grid = solve_sudoku(sudoku_grid)

        if solved_sudoku_grid is None:
            return jsonify({"error": "Failed to solve Sudoku"}), 500

        # Return the resulting Sudoku grid and the solved grid as JSON
        return jsonify({
            "input_grid": sudoku_grid,
            "solved_grid": solved_sudoku_grid
        })
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({"error": "An error occurred while processing the image"}), 500

if __name__ == '__main__':
    app.run(debug=True)
