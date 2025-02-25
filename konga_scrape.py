import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

# Configure Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in background
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")

# Initialize the WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

try:
    # Open Konga
    url = "https://www.konga.com/category/phones-tablets-5261"
    logger.info(f"Opening {url}")
    driver.get(url)
    
    # Wait for page to load
    time.sleep(5)
    
    # Save page source for debugging
    with open("konga_page_source.html", "w", encoding="utf-8") as f:
        f.write(driver.page_source)
    logger.info("Saved page source to konga_page_source.html")
    
    # Find product elements
    products = []
    product_elements = driver.find_elements(By.CSS_SELECTOR, "div.af885_1iPzH")
    
    logger.info(f"Found {len(product_elements)} products")
    
    for element in product_elements[:5]:  # Get first 5 products for testing
        try:
            # Extract product details
            name_element = element.find_element(By.CSS_SELECTOR, "div.af885_1iPzH h3")
            price_element = element.find_element(By.CSS_SELECTOR, "div.af885_1iPzH span._4e81a_39Ehs")
            link_element = element.find_element(By.TAG_NAME, "a")
            
            product = {
                "name": name_element.text.strip(),
                "price": price_element.text.strip(),
                "url": link_element.get_attribute("href")
            }
            products.append(product)
            logger.info(f"Extracted product: {product['name']}")
        except Exception as e:
            logger.error(f"Error extracting product: {e}")
    
    # Save products to JSON
    with open("konga_products_selenium.json", "w", encoding="utf-8") as f:
        json.dump(products, f, indent=4)
    logger.info(f"Saved {len(products)} products to konga_products_selenium.json")
    
finally:
    driver.quit()