import random
import pandas as pd
from faker import Faker
import numpy as np

# Set up Faker with multiple locales
fake_en = Faker('en_US')
fake_zh = Faker('zh_TW')

# Create lists to store data
data = []

# Generate 10 records (you can adjust this number)
for _ in range(10):
    # Randomly choose between English and Chinese names/addresses
    is_chinese = random.choice([True, False])
    
    if is_chinese:
        name = fake_zh.company()
        address = fake_zh.address()
        city = fake_zh.city()
        country = "台灣"
    else:
        name = fake_en.company()
        address = fake_en.street_address()
        city = fake_en.city()
        country = fake_en.country()
    
    # Generate email based on company name
    email = f"info@{name.lower().replace(' ', '').replace(',', '')}.com"
    
    # Generate reasonable longitude/latitude for Taiwan and worldwide
    if is_chinese:
        # Taiwan coordinates approximately
        longitude = random.uniform(120.0, 122.0)
        latitude = random.uniform(21.9, 25.3)
    else:
        # Worldwide coordinates
        longitude = random.uniform(-180.0, 180.0)
        latitude = random.uniform(-90.0, 90.0)
    
    # Random boolean for is_open
    is_open = random.choice([True, False])
    
    # Add the record
    data.append({
        'name': name,
        'address': address,
        'email': email,
        'country': country,
        'city': city,
        'longitude': round(longitude, 6),
        'latitude': round(latitude, 6),
        'is_open': is_open
    })

# Create DataFrame
df = pd.DataFrame(data)

# Add the specific example from the input
example_row = {
    'name': '礁溪老爺酒店',
    'address': '五峰路69號',
    'email': 'https://www.hotelroyal.com.tw',
    'country': '台灣',
    'city': '宜蘭',
    'longitude': 121.776,
    'latitude': 24.671,
    'is_open': True
}
df = pd.concat([pd.DataFrame([example_row]), df], ignore_index=True)

# Save to CSV file
df.to_csv('hotel_data.csv', index=False, encoding='utf-8-sig')
print("Data has been saved to 'hotel_data.csv'")