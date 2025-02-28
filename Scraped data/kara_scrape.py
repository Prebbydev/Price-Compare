import time
import json
import uuid
import requests
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Backend API Endpoint
API_ENDPOINT = "https://price-compare-backend.onrender.com/api/products/bulk-create"

# Kara Categories to Scrape
categories = {
    "mobile-phones": "https://www.kara.com.ng/mobile-phones",
    "laptops": "https://www.kara.com.ng/laptops",
    "televisions": "https://www.kara.com.ng/tv-audio",
    "home-appliances": "https://www.kara.com.ng/home-appliances",
    "electronics": "https://www.kara.com.ng/electronics",
    "generators": "https://www.kara.com.ng/generators",
    "networking": "https://www.kara.com.ng/networking",
    "security-surveillance": "https://www.kara.com.ng/security-surveillance",
    "printers": "https://www.kara.com.ng/printers",
    "accessories": "https://www.kara.com.ng/accessories",
}

# Selenium setup
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920x1080")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


# Generate a random product ID
def generate_product_id():
    return str(uuid.uuid4())[:8]


# Function to clean & convert scraped data
def clean_product_data(product):
    # Convert price to number (remove non-numeric characters)
    price_match = re.search(r"\d+", str(product["price"]).replace(",", ""))
    product["price"] = int(price_match.group()) if price_match else 0

    # Convert availability to Boolean
    product["availability"] = product["availability"].lower() == "in stock"

    # Convert average_rating to Float
    product["average_rating"] = float(product["average_rating"]) if product["average_rating"].isdigit() else 0.0

    # Convert number_of_reviews to Integer
    product["number_of_reviews"] = int(product["number_of_reviews"]) if product["number_of_reviews"].isdigit() else 0

    # Ensure full product URL
    if not product["url"].startswith("http"):
        product["url"] = "https://www.kara.com.ng" + product["url"]

    return product


# Scrape Kara website
def scrape_kara():
    all_products = []

    for category, url in categories.items():
        print(f"Scraping {category}...")
        driver.get(url)
        time.sleep(5)  # Allow time for the page to load

        soup = BeautifulSoup(driver.page_source, "html.parser")
        products = soup.find_all("div", class_="product-item-details")

        for product in products[:10]:  # Limit to 10 per category
            try:
                name_tag = product.find("a", class_="product-item-link")
                product_name = name_tag.text.strip() if name_tag else "Unknown"

                price_tag = product.find("span", class_="price-wrapper")
                price = price_tag.text.strip() if price_tag else "0"

                url_tag = name_tag["href"] if name_tag else ""
                img_tag = product.find_previous("img", src=True)
                img_url = img_tag["src"] if img_tag else ""

                availability = "In stock" if price != "0" else "Out of stock"

                product_data = {
                    "product_id": generate_product_id(),
                    "product_name": product_name,
                    "category": category,
                    "brand": "Unknown",
                    "price": price,
                    "availability": availability,
                    "average_rating": "0",
                    "number_of_reviews": "0",
                    "url": url_tag,
                    "image_url": img_url,
                    "store": {
                        "name": "Kara",
                        "website_url": "https://www.kara.com.ng",
                        "location": "Nigeria"
                    }
                }
                all_products.append(product_data)
                print(f"Scraped: {product_name}, {price}, {url_tag}, {img_url}")

            except Exception as e:
                print(f"Error scraping product: {e}")

    return all_products


# Function to send data in batches
def send_to_backend(data, batch_size=20):
    if not data:
        print("⚠️ No data to send.")
        return

    print(f"📤 Sending {len(data)} Kara products to the backend in batches of {batch_size}...")

    for i in range(0, len(data), batch_size):
        batch = [clean_product_data(p) for p in data[i: i + batch_size]]  # Clean each product

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
    while True:
        kara_data = scrape_kara()
        send_to_backend(kara_data)
        print("✅ Kara data transfer completed!")
        print("⏳ Waiting for 5 minutes before the next update...")
        time.sleep(300)  # Wait 5 minutes before scraping again
