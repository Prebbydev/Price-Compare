import time
import json
import schedule
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def scrape_olist():
    url = "https://www.olist.ng/agriculture-food"

    # Check if the site is reachable before launching Selenium
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(f"[ERROR] OList is down. Status Code: {response.status_code}")
            return
    except requests.ConnectionError:
        print("[ERROR] Internet issue: Cannot reach OList.")
        return

    options = Options()
    options.add_argument("--headless=new")

    for attempt in range(3):  # Retry up to 3 times
        try:
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
            driver.get(url)
            time.sleep(5)

            products = driver.find_elements(By.CSS_SELECTOR, 'div.listings-cards__list div.listings-card')

            scraped_data = []
            for product in products[:10]:
                try:
                    name = product.find_element(By.CSS_SELECTOR, 'h2.listings-card__title').text
                    price = product.find_element(By.CSS_SELECTOR, 'span.listings-card__price').text
                    location = product.find_element(By.CSS_SELECTOR, 'span.listings-card__location').text
                    url = product.find_element(By.CSS_SELECTOR, 'a').get_attribute("href")

                    scraped_data.append({
                        "name": name,
                        "price": price,
                        "location": location,
                        "url": url
                    })
                except Exception as e:
                    print("[WARNING] Skipping product:", e)

            driver.quit()

            if scraped_data:
                with open("olist_data.json", "w", encoding="utf-8") as f:
                    json.dump(scraped_data, f, indent=4)

                print(f"[INFO] {len(scraped_data)} products saved to olist_data.json")
            return

        except Exception as e:
            print(f"[ERROR] Attempt {attempt + 1}: {e}")
            time.sleep(5)  # Wait before retrying

    print("[ERROR] Scraper failed after 3 attempts.")

# Schedule every 5 minutes
schedule.every(5).minutes.do(scrape_olist)

print("[INFO] OList scraper running every 5 minutes... Press CTRL+C to stop.")

while True:
    schedule.run_pending()
    time.sleep(1)
