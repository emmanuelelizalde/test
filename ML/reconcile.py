import json
import os
from datetime import datetime
import pandas as pd

INVENTORY_FILE = "../analysis/inventory.csv"
PREDICTIONS_DIR = "predictions"
AUDIT_LOG_FILE = "audit_log.jsonl"

CONF_THRESHOLD = 0.90

inventory_df = pd.read_csv(INVENTORY_FILE)

audit_events = []

for filename in os.listdir(PREDICTIONS_DIR):
    if filename.endswith(".json"):
        file_path = os.path.join(PREDICTIONS_DIR, filename)

        with open(file_path, "r") as file:
            prediction_data = json.load(file)

        scene_id = prediction_data["scene_id"]

        for prediction in prediction_data["predictions"]:
            item_name = prediction["name"]
            confidence = prediction["confidence"]

            if confidence < CONF_THRESHOLD:
                event_type = "UNCERTAIN"
                recommended_action = "Manual review required due to low confidence"

            else:
                matching_item = inventory_df[inventory_df["name"] == item_name]

                if matching_item.empty:
                    event_type = "DISCREPANCY"
                    recommended_action = "Item detected but not found in inventory database"

                else:
                    quantity = int(matching_item.iloc[0]["quantity"])

                    if quantity > 0:
                        event_type = "VERIFIED"
                        recommended_action = "No action needed"
                    else:
                        event_type = "DISCREPANCY"
                        recommended_action = "Item detected on shelf but database says quantity is 0"

            audit_event = {
                "timestamp": datetime.now().isoformat(),
                "scene_id": scene_id,
                "item": item_name,
                "event_type": event_type,
                "confidence": confidence,
                "recommended_action": recommended_action,
            }

            audit_events.append(audit_event)

with open(AUDIT_LOG_FILE, "w") as file:
    for event in audit_events:
        file.write(json.dumps(event) + "\n")

print("Audit log created:", AUDIT_LOG_FILE)

print("\nSummary:")
print("VERIFIED:", sum(1 for e in audit_events if e["event_type"] == "VERIFIED"))
print("DISCREPANCY:", sum(1 for e in audit_events if e["event_type"] == "DISCREPANCY"))
print("UNCERTAIN:", sum(1 for e in audit_events if e["event_type"] == "UNCERTAIN"))