import pandas as pd

# load CSV
df = pd.read_csv("inventory.csv")

# total items
print("Total items:", len(df))

# group by category
print("\nItems by category:")
print(df.groupby("category").size())

# low stock (you define threshold)
low_stock = df[df["quantity"] < 5]

print("\nLow stock items:")
if low_stock.empty:
    print("Stocked up")
else:
    print(low_stock[["name", "quantity"]])