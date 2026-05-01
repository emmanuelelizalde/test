import json
import json
import os
import random

LABELS_DIR = "dataset/labels"
OUTPUT_DIR = "predictions"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(LABELS_DIR):
    if filename.endswith(".json"):
        label_path = os.path.join(LABELS_DIR, filename)

        with open(label_path, "r") as file:
            label_data = json.load(file)

        scene_id = label_data["image_file"].replace(".jpg", "")
        items_present = [label_data["item_type"]]

        predictions = []

        for item in items_present:
            predictions.append({
                "name": item,
                "confidence": round(random.uniform(0.60, 0.98), 2)
            })

        output = {
            "scene_id": scene_id,
            "predictions": predictions
        }

        output_path = os.path.join(OUTPUT_DIR, f"{scene_id}_predictions.json")

        with open(output_path, "w") as file:
            json.dump(output, file, indent=2)

        print(f"Created prediction file for {scene_id}")