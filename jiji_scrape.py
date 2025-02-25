from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

# Configure Selenium to use headless mode for efficiency
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Automatically install the appropriate ChromeDriver version
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# Base URL for Jiji categories
BASE_URL = "https://jiji.ng/{}?page={}"

# Categories to scrape
categories = ["mobile-phones", "laptops", "tvs", "home-appliances", "electronics"]

# Function to scrape a single page
def scrape_page(category, page):
    url = BASE_URL.format(category, page)
    driver.get(url)
    
    try:
        # Wait until product elements are loaded
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "b-list-advert__item"))
        )
        products = driver.find_elements(By.CLASS_NAME, "b-list-advert__item")
        
        product_list = []
        for product in products:
            try:
                title = product.find_element(By.CLASS_NAME, "b-advert-title-inner").text
                price = product.find_element(By.CLASS_NAME, "b-list-advert__item-price").text
                link = product.find_element(By.CLASS_NAME, "b-list-advert__item-link").get_attribute("href")
                
                product_list.append({
                    "title": title,
                    "price": price,
                    "link": link
                })
            except Exception as e:
                print(f"Error extracting product details: {e}")
        
        return product_list
    except Exception as e:
        print(f"Error loading page {url}: {e}")
        return []

# Main scraping function
def scrape_category(category, max_pages=5):
    all_products = []
    for page in range(1, max_pages + 1):
        print(f"Scraping {category}, page {page}")
        products = scrape_page(category, page)
        if not products:
            break  # Stop if no products are found
        all_products.extend(products)
        time.sleep(2)  # Respectful delay
    return all_products

# Dictionary to store scraped data
scraped_data = {}

# Scrape each category
for category in categories:
    scraped_data[category] = scrape_category(category)

# Save data to a JSON file
with open("jiji_products.json", "w", encoding="utf-8") as f:
    json.dump(scraped_data, f, ensure_ascii=False, indent=4)

# Close WebDriver
driver.quit()
