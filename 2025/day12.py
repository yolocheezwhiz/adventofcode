import requests
import os
import re
from datetime import datetime

day = 12
SESSION_COOKIE = open('session_cookie.txt').read() # Get session cookie on AOC website. Save locally. Use for authentication
url = f'https://adventofcode.com/2025/day/{day}/input'

# Read puzzle input from cache, or fetch and cache it
year = url.split('/')[3]
day = url.split('/')[-2].replace('day', '')
cache_file = f'{year}d{day}.txt'
if os.path.exists(cache_file):
    input_text = open(cache_file).read()
else:
    headers = {'Cookie': f'session={SESSION_COOKIE}'}
    response = requests.get(url, headers=headers)
    input_text = response.text.strip()
    with open(cache_file, 'w') as f:
        f.write(input_text)

current_datetime = datetime.now()
answerp1 = 0
closest_call = float('inf')
total_area_of_closest_call = None
lines = input_text.split('\n')

# Auto-generate ranges: lines 1-3, 6-8, 11-13, etc.
sizes = [
    # Count # in each shape
    sum(line.count('#') for line in lines[start:start+3])
    for start in range(1, 27, 5)
]

for line in lines[30:]:
    # Parse each line in an array of integers
    arr = list(map(int, re.split(r'x|: | ', line)))
    # Multiply the first two numbers => Total Area
    total_area = arr[0] * arr[1]
    # Multiply other numbers by their respectize shape's size => Combined Shapes Area
    combined_shapes_area = sum(arr[i+2] * sizes[i] for i in range(6))
    # Simply check if the combined shapes area is bigger than total area
    remaining_area = total_area - combined_shapes_area
    if remaining_area >= 0: 
        # It potential fit in the total area
        answerp1 += 1
        # This is not strictly necessary but it tracks the closest call
        # meaning the line where there was "not much" area left after placing the shapes
        # Point is to show that it never was really close. 
        # And we don't need to actually try to place the shapes
        # We just need to see if they would theoritically fit the area 
        if remaining_area < closest_call:
            closest_call = remaining_area
            total_area_of_closest_call = total_area
        
print(f'Answer part 1: {answerp1}')
print(f'There closest call was: {closest_call} remaining area on a total area of: {total_area_of_closest_call}')
print(f'Solved in: {datetime.now() - current_datetime}')
