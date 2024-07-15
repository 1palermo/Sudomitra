import easyocr
import numpy as np
from PIL import Image

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])

# Load the image
image_path = "input.jpg"
image = Image.open(image_path)

# Perform OCR on the image with bounding boxes
results = reader.readtext(np.array(image))

# Initialize an empty 9x9 grid with zeros
sudoku_grid = [[0 for _ in range(9)] for _ in range(9)]

# Function to map OCR results to the grid using bounding boxes
def map_results_to_grid(results):
    # Define grid dimensions and cell size (this might need adjustment based on your image)
    grid_size = 9
    image_width, image_height = image.size
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

# Print the resulting Sudoku grid
for row in sudoku_grid:
    print(row)
