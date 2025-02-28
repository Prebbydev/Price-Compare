import json
import requests
import time
import re

API_ENDPOINT = "https://price-compare-backend.onrender.com/api/products/bulk-create"
CHECK_EXISTING_ENDPOINT = "https://price-compare-backend.onrender.com/api/products"

def load_rivers_data():
    try:
        with open("rivers_food.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print("❌ Error: rivers_food.json file not found!")
        return []
    except json.JSONDecodeError:
        print("❌ Error: Invalid JSON format in rivers_food.json!")
        return []

def clean_product_data(product):
    if isinstance(product["availability"], str):
        product["availability"] = True if product["availability"].lower() == "in stock" else False

    rating_match = re.search(r"(\d+(\.\d+)?)", str(product["average_rating"]))
    product["average_rating"] = float(rating_match.group(1)) if rating_match else 0.0

    reviews_match = re.search(r"\d+", str(product["number_of_reviews"]))
    product["number_of_reviews"] = int(reviews_match.group()) if reviews_match else 0

    return product

# ✅ Check which product IDs already exist
def get_existing_product_ids():
    try:
        response = requests.get(CHECK_EXISTING_ENDPOINT)
        if response.status_code == 200:
            existing_products = response.json()
            return {product["product_id"] for product in existing_products}
        else:
            print(f"⚠️ Warning: Could not fetch existing products. Status Code: {response.status_code}")
            return set()
    except requests.RequestException as e:
        print(f"⚠️ Warning: Error fetching existing products: {e}")
        return set()

# ✅ Filter out duplicates before sending data
def send_to_backend(data, batch_size=20):
    if not data:
        print("⚠️ No data to send.")
        return

    existing_product_ids = get_existing_product_ids()
    new_data = [p for p in data if p["product_id"] not in existing_product_ids]

    if not new_data:
        print("✅ No new products to add. Everything is already in the database.")
        return

    print(f"📤 Sending {len(new_data)} new Lagos data to the backend in batches of {batch_size}...")

    for i in range(0, len(new_data), batch_size):
        batch = [clean_product_data(p) for p in new_data[i : i + batch_size]]
        try:
            response = requests.post(API_ENDPOINT, json=batch, headers={"Content-Type": "application/json"})
            if response.status_code == 201:
                print(f"✅ Batch {i // batch_size + 1} sent successfully.")
            else:
                print(f"❌ Failed to send batch {i // batch_size + 1}. Status Code: {response.status_code}, Response: {response.text}")
        except requests.RequestException as e:
            print(f"❌ Error sending batch {i // batch_size + 1}: {e}")

# ✅ Run the script
if __name__ == "__main__":
    rivers_data = load_rivers_data()
    send_to_backend(rivers_data)
    print("rivers data transfer completed!")
