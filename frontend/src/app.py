from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(['en'])

def decode_image(image_base64):
    try:
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

@app.route('/ocr', methods=['POST'])
def ocr():
    data = request.get_json()
    image_base64 = data['image']
    image = decode_image(image_base64)
    if image is None:
        return jsonify({"error": "Failed to decode image"}), 400
    
    results = reader.readtext(image)
    
    sudoku_grid = [[0 for _ in range(9)] for _ in range(9)]

    def map_results_to_grid(results):
        grid_size = 9
        image_height, image_width = image.shape[:2]
        cell_width = image_width / grid_size
        cell_height = image_height / grid_size

        for result in results:
            bbox, text, _ = result
            if text.isdigit():
                x_center = (bbox[0][0] + bbox[2][0]) / 2
                y_center = (bbox[0][1] + bbox[2][1]) / 2
                row = int(y_center // cell_height)
                col = int(x_center // cell_width)
                sudoku_grid[row][col] = int(text)

    map_results_to_grid(results)
    return jsonify(sudoku_grid)

if __name__ == '__main__':
    app.run(debug=True)
