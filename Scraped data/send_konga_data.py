import json
import requests
import time
import re

# Backend API Endpoint
API_ENDPOINT = "https://price-compare-backend.onrender.com/api/products/bulk-create"

# Load the Konga JSON file
def load_konga_data():
    try:
        with open("konga_products.json", "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print("❌ Error: konga_products.json file not found!")
        return []
    except json.JSONDecodeError:
        print("❌ Error: Invalid JSON format in konga_products.json!")
        return []

# Function to clean & convert data types
def clean_product_data(product):
    # Convert availability from string → Boolean
    product["availability"] = True if product["availability"].lower() == "in stock" else False

    # Convert "average_rating" from string → Float (or set to 0.0 if missing)
    rating_match = re.search(r"(\d+(\.\d+)?)", str(product["average_rating"]))
    product["average_rating"] = float(rating_match.group(1)) if rating_match else 0.0

    # Convert "number_of_reviews" from string → Integer (or set to 0 if missing)
    reviews_match = re.search(r"\d+", str(product["number_of_reviews"]))
    product["number_of_reviews"] = int(reviews_match.group()) if reviews_match else 0

    return product

# Function to send data in batches to backend
def send_to_backend(data, batch_size=20):
    if not data:
        print("⚠️ No data to send.")
        return

    print(f"📤 Sending {len(data)} Konga products to the backend in batches of {batch_size}...")

    for i in range(0, len(data), batch_size):
        batch = [clean_product_data(p) for p in data[i : i + batch_size]]  # Clean each product

        try:
            response = requests.post(API_ENDPOINT, json=batch, headers={"Content-Type": "application/json"})

            if response.status_code == 201:
                print(f"✅ Batch {i // batch_size + 1} sent successfully.")
            else:
                print(f"❌ Failed to send batch {i // batch_size + 1}. Status Code: {response.status_code}, Response: {response.text}")

        except requests.RequestException as e:
            print(f"❌ Error sending batch {i // batch_size + 1}: {e}")

# Main execution
if __name__ == "__main__":
    konga_data = load_konga_data()
    send_to_backend(konga_data)
    print("✅ Konga data transfer completed!")
