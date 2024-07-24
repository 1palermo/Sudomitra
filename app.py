from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import numpy as np
from PIL import Image
import io
from sudoku_solver import solve_sudoku  # Make sure this module is available

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for simplicity

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])

def decode_image(image_data):
    try:
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        return np.array(image)
    except Exception as e:
        print(f"Error decoding image: {e}")
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

        # Return the resulting Sudoku grid as JSON
        return jsonify({
            "input_grid": sudoku_grid
        })
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({"error": "An error occurred while processing the image"}), 500

@app.route('/solve', methods=['POST'])
def solve_sudoku_endpoint():
    try:
        data = request.json
        input_grid = data.get('input_grid')

        if not input_grid or not isinstance(input_grid, list) or len(input_grid) != 9 or not all(len(row) == 9 for row in input_grid):
            return jsonify({"error": "Invalid input grid"}), 400

        # Solve the Sudoku puzzle
        solved_sudoku_grid = solve_sudoku(input_grid)

        if solved_sudoku_grid is None:
            return jsonify({"error": "Failed to solve Sudoku"}), 500

        # Return the solved grid as JSON
        return jsonify({
            "solved_grid": solved_sudoku_grid
        })
    except Exception as e:
        print(f"Error solving Sudoku: {e}")
        return jsonify({"error": "An error occurred while solving the Sudoku"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
