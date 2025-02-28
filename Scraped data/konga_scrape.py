import time
import json
import uuid
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import random

def generate_product_id():
    return str(uuid.uuid4())[:8]

def scrape_konga():
    categories = {
        "mobile-phones": "https://www.konga.com/category/phones-tablets-5299",
        "laptops": "https://www.konga.com/category/computers-accessories-5227",
        "televisions": "https://www.konga.com/category/electronics-5260",
        "home-appliances": "https://www.konga.com/category/home-kitchen-2478",
        "electronics": "https://www.konga.com/category/electronics-5260",
        "generators": "https://www.konga.com/category/generators-2328",
        "networking": "https://www.konga.com/category/networking-2356",
        "security-surveillance": "https://www.konga.com/category/security-surveillance-2402",
        "printers": "https://www.konga.com/category/printers-scanners-2728",
        "accessories": "https://www.konga.com/category/accessories-5240"
    }
    
    ua = UserAgent()
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")
    options.add_argument(f"user-agent={ua.random}")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    all_products = []
    
    for category, url in categories.items():
        try:
            driver.get(url)
            time.sleep(random.randint(5, 10))  # Randomized delay
            
            soup = BeautifulSoup(driver.page_source, "html.parser")
            products = soup.find_all("div", class_="af885_1iPzH")
            
            for product in products[:10]:  # Limit to 10 per category
                try:
                    product_name = product.find("a", class_="_24849_2Ymhg").text.strip()
                    price = product.find("span", class_="d7c0f_sJAqi").text.strip()
                    url_tag = product.find("a", href=True)
                    url = "https://www.konga.com" + url_tag["href"] if url_tag else ""
                    img_tag = product.find("img", src=True)
                    img_url = img_tag["src"] if img_tag else ""
                    
                    availability = "In stock" if price else "Out of stock"
                    
                    product_data = {
                        "product_id": generate_product_id(),
                        "product_name": product_name,
                        "category": category,
                        "brand": "Unknown",
                        "price": price,
                        "availability": availability,
                        "average_rating": "0",
                        "number_of_reviews": "0",
                        "url": url,
                        "store": {
                            "name": "Konga",
                            "website_url": "https://www.konga.com",
                            "location": "Nigeria"
                        }
                    }
                    all_products.append(product_data)
                except Exception as e:
                    print(f"Error scraping product: {e}")
        except Exception as e:
            print(f"Error accessing category {category}: {e}")
    
    driver.quit()
    
    with open("konga_products.json", "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=4, ensure_ascii=False)
    
    print("Data scraping complete. JSON file saved.")

if __name__ == "__main__":
    while True:
        scrape_konga()
        print("Waiting for 5 minutes before the next update...")
        time.sleep(300)  # Wait 5 minutes before scraping again
