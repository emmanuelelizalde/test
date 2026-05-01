import json
import os

PREDICTIONS_DIR = "predictions"
CONF_THRESHOLD = 0.9

accepted = []
uncertain = []

for filename in os.listdir(PREDICTIONS_DIR):
    if filename.endswith(".json"):
        with open(os.path.join(PREDICTIONS_DIR, filename)) as f:
            data = json.load(f)

        scene_id = data["scene_id"]

        for pred in data["predictions"]:
            item = pred["name"]
            confidence = pred["confidence"]

            if confidence >= CONF_THRESHOLD:
                accepted.append((scene_id, item, confidence))
            else:
                uncertain.append((scene_id, item, confidence))

# Output results
print("Accepted predictions:")
for a in accepted:
    print(a)

print("\nUncertain predictions:")
for u in uncertain:
    print(u)

print("\nCounts:")
print("Accepted:", len(accepted))
print("Uncertain:", len(uncertain))