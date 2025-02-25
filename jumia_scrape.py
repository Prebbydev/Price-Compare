import requests
import json
import time
from bs4 import BeautifulSoup

// List of categories to scrape
CATEGORIES = {
    "smartphones": "https://www.jumia.com.ng/smartphones/",
    "laptops": "https://www.jumia.com.ng/catalog/?q=laptop",
    "televisions": "https://www.jumia.com.ng/catalog/?q=television",
    "refrigerators": "https://www.jumia.com.ng/catalog/?q=refrigerator",
    "shoes": "https://www.jumia.com.ng/catalog/?q=shoes"
}

// Headers to prevent bot detection
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
}

// Function to scrape products from a category
def scrape_category(category_name, category_url):
    try:
        response = requests.get(category_url, headers=HEADERS)
        if response.status_code != 200:
            print(f"⚠️ Failed to fetch {category_name}, status code: {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        products = soup.find_all("article", class_="prd _fb col c-prd")  # Find all product containers

        category_data = []

        for product in products:
            try:
                name_tag = product.find("h3", class_="name")
                price_tag = product.find("div", class_="prc")
                image_tag = product.find("img", class_="img")
                link_tag = product.find("a", class_="link")

                product_name = name_tag.text.strip() if name_tag else "N/A"
                product_price = price_tag.text.strip() if price_tag else "N/A"
                product_image = image_tag["data-src"] if image_tag and "data-src" in image_tag.attrs else "N/A"
                product_link = "https://www.jumia.com.ng" + link_tag["href"] if link_tag else "N/A"

                // Store product details
                category_data.append({
                    "category": category_name,
                    "name": product_name,
                    "price": product_price,
                    "image": product_image,
                    "link": product_link
                })

            except Exception as e:
                print(f"⚠️ Error scraping product in {category_name}: {e}")

        return category_data

    except Exception as e:
        print(f"⚠️ Error fetching {category_name}: {e}")
        return []

// Function to scrape all categories
def scrape_all_categories():
    all_data = []

    for category, url in CATEGORIES.items():
        print(f"🔄 Scraping category: {category}...")
        category_data = scrape_category(category, url)
        all_data.extend(category_data)

    return all_data

// Function to save data to JSON
def save_to_json(data, filename="jumia_products.json"):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    print(f"✅ Data saved to {filename}")

// Function to run the scraper every 5 minutes
def run_scraper():
    while True:
        print("\n🚀 Starting Jumia Scraper for Multiple Categories...\n")
        scraped_data = scrape_all_categories()

        if scraped_data:
            save_to_json(scraped_data)
        else:
            print("⚠️ No data scraped. Check website structure or connection.")

        print("⏳ Waiting 5 minutes before the next update...")
        time.sleep(300)  // 300 seconds = 5 minutes

// Run the scraper
if __name__ == "__main__":
    run_scraper()
