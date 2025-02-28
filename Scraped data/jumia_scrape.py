import json
import time
import random
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Backend API Endpoint
API_ENDPOINT = "https://price-compare-backend.onrender.com/api/products/bulk-create"

# Setup Selenium
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode (no browser UI)
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920x1080")
chrome_options.add_argument("--log-level=3")  # Reduce logs

# Initialize WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# Jumia Categories to Scrape
categories = {
    "mobile-phones": "https://www.jumia.com.ng/mobile-phones/",
    "laptops": "https://www.jumia.com.ng/laptops/",
    "televisions": "https://www.jumia.com.ng/televisions/",
    "refrigerators": "https://www.jumia.com.ng/refrigerators/",
    "washing-machines": "https://www.jumia.com.ng/washing-machines/",
    "air-conditioners": "https://www.jumia.com.ng/air-conditioners/",
    "cameras": "https://www.jumia.com.ng/cameras/",
    "gaming": "https://www.jumia.com.ng/video-games/",
    "home-theatre": "https://www.jumia.com.ng/home-theatre-audio/",
    "generators": "https://www.jumia.com.ng/generators/"
}

# Function to clean and convert rating/reviews to numbers
def clean_number(value, default=0):
    try:
        return int(value) if value.isdigit() else float(value.split(" ")[0])
    except:
        return default

# Function to clean price (Handles ranges like "55000 - 65000")
def clean_price(price_text):
    try:
        price = price_text.split("-")[0].strip()  # Take the lower value if it's a range
        return float(price)
    except:
        return 0  # Default to 0 if price parsing fails

# Function to scrape Jumia category pages
def scrape_jumia(category_name, category_url):
    print(f"🔄 Scraping {category_name}...")
    driver.get(category_url)
    time.sleep(random.uniform(3, 5))  # Random delay to avoid detection

    products = driver.find_elements(By.CSS_SELECTOR, "article.prd")
    scraped_data = []
    
    for product in products:
        try:
            product_name = product.find_element(By.CSS_SELECTOR, "h3.name").text
            raw_price = product.find_element(By.CSS_SELECTOR, "div.prc").text.replace("₦", "").replace(",", "").strip()
            price = clean_price(raw_price)
            product_url = product.find_element(By.CSS_SELECTOR, "a.core").get_attribute("href")
            image_url = product.find_element(By.CSS_SELECTOR, "img.img").get_attribute("data-src")

            try:
                brand = product.find_element(By.CSS_SELECTOR, "div.brand").text
            except:
                brand = "Unknown"

            try:
                raw_rating = product.find_element(By.CSS_SELECTOR, "div.stars").get_attribute("aria-label")
                average_rating = clean_number(raw_rating, 0)  # Extract numeric rating
            except:
                average_rating = 0  # Default if not found

            try:
                raw_reviews = product.find_element(By.CSS_SELECTOR, "div.rev").text.replace("(", "").replace(")", "").strip()
                number_of_reviews = clean_number(raw_reviews, 0)  # Extract numeric reviews count
            except:
                number_of_reviews = 0  # Default if not found

            product_data = {
                "product_id": f"jumia_{random.randint(10000, 99999)}",
                "product_name": product_name,
                "category": category_name,
                "brand": brand,
                "price": price,
                "availability": True,
                "average_rating": average_rating,
                "number_of_reviews": number_of_reviews,
                "url": product_url,
                "image_url": image_url,
                "store": {
                    "name": "Jumia Nigeria",
                    "website_url": "https://www.jumia.com.ng/",
                    "location": "Nigeria"
                }
            }
            
            scraped_data.append(product_data)
        
        except Exception as e:
            print(f"⚠️ Error scraping product: {e}")

    return scraped_data

# Function to send scraped data to backend API in batches
def send_to_backend(data, batch_size=20):
    if not data:
        print("⚠️ No data to send.")
        return

    print(f"📤 Sending {len(data)} products to the backend in batches of {batch_size}...")

    for i in range(0, len(data), batch_size):
        batch = data[i : i + batch_size]

        try:
            response = requests.post(API_ENDPOINT, json=batch, headers={"Content-Type": "application/json"})

            if response.status_code == 201:
                print(f"✅ Batch {i // batch_size + 1} sent successfully.")
            else:
                print(f"❌ Failed to send batch {i // batch_size + 1}. Status Code: {response.status_code}, Response: {response.text}")

        except requests.RequestException as e:
            print(f"❌ Error sending batch {i // batch_size + 1}: {e}")

# Main loop: Scrape every 5 minutes and send to backend
while True:
    all_data = []
    
    for category, url in categories.items():
        all_data.extend(scrape_jumia(category, url))
    
    send_to_backend(all_data)  # Send data to backend in batches
    
    print("⏳ Waiting 5 minutes before next scrape...")
    time.sleep(300)  # Wait 5 minutes before next scrape
