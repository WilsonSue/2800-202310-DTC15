from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import time
import random
import os


load_dotenv()


# List of user agent strings to simulate different browsers/platforms
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 "
    "Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 "
    "Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 "
    "Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 "
    "Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 "
    "Safari/537.36 Edg/94.0.992.47",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 "
    "Safari/537.36",
]


def create_scraper():
    """
    Create and configure a Chrome WebDriver instance for web scraping.
    """
    options = Options()
    options.add_argument(f"--user-agent={random.choice(user_agents)}")
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    return webdriver.Chrome(options=options)


def extract_indeed(page):
    """
    Scrape the job listings page on Indeed.com and return the parsed HTML.
    """
    try:
        scraper = create_scraper()
        url = f'https://ca.indeed.com/jobs?q=developer&l=canada&start={page}'
        scraper.get(url)
        soup = BeautifulSoup(scraper.page_source, 'html.parser')
        scraper.quit()
        time.sleep(random.uniform(2, 10))
        return soup
    except Exception as e:
        print("Error occurred while scraping Indeed:")
        print(e)


def extract_each_job_page(url):
    """
    Extract detailed information from an individual job page and return the extracted data.
    """
    try:
        scraper = create_scraper()
        scraper.get(url)
        soup = BeautifulSoup(scraper.page_source, 'html.parser')
        scraper.quit()
        job_description = soup.find('div', class_='jobsearch-jobDescriptionText').text
        salary_val, job_type_val, schedule_val = 'None Given', 'None Given', 'None Given'
        job_details_section = soup.find('div', class_='css-804pn3 eu4oa1w0')
        if job_details_section:
            job_details = job_details_section.find_all('div', class_='css-4m8ia3 eu4oa1w0')
            for detail in job_details:
                label = detail.find('div', class_='css-fhkva6 eu4oa1w0')
                value = detail.find('div', class_='css-1hplm3f eu4oa1w0')
                if label and value:
                    label_text = label.text.strip()
                    if label_text == 'Salary':
                        salary_val = value.text.strip()
                    elif label_text == 'Job type':
                        job_type_val = value.text.strip()
                    elif label_text == 'Shift & schedule':
                        schedule_val = value.text.strip()
        return salary_val, job_type_val, schedule_val, job_description
    except Exception as e:
        print("Error occurred while extracting job details:")
        print(e)


def transform(soup, joblist):
    """
    Extract relevant information from each job listing and append it to the joblist.
    """
    divs = soup.find_all('div', class_='job_seen_beacon')
    for item in divs:
        title = item.find('a').text.strip()
        company = item.find('span', class_='companyName').text
        location = item.find('div', class_='companyLocation').text
        rating_div = item.find('span', class_='ratingNumber')
        rating = rating_div.text if rating_div is not None else "None Given"
        link = 'https://ca.indeed.com/viewjob?jk='+item.find('a')['data-jk']
        summary = item.find('div', class_='job-snippet').text.strip().replace('\n', '')
        salary, job_type, shift_schedule, job_description = extract_each_job_page(link)

        job = {
            'JobTitle': title,
            'CompanyName': company,
            'Location': location,
            'Rating': rating,
            'Link': link,
            'Summary': summary,
            'SalaryEstimate': salary,
            'JobType': job_type,
            'ShiftSchedule': shift_schedule,
            'JobDescription': job_description
        }
        joblist.append(job)
    return


def update_mongo(data):
    """
    Update MongoDB database with the scraped job data.
    """
    client = MongoClient(os.getenv("CONNECTION_STRING"))
    db = client[os.getenv("MONGODB_DATABASE")]
    collection = db["test"]
    collection.delete_many({})
    collection.insert_many(data)
    client.close()


def main():
    joblist = []

    for i in range(1, 2):
        print(f'Getting page,{i}')
        time.sleep(random.uniform(2, 10))
        c = extract_indeed(0)
        transform(c, joblist)

    df = pd.DataFrame(joblist)
    # df.to_csv('jobs.csv')

    update_mongo(joblist)
    print("script finished running")


if __name__ == "__main__":
    main()
