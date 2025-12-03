import requests
from datetime import datetime
import os

day = 2
SESSION_COOKIE = open('session_cookie.txt').read() # Get session cookie on AOC website. Save locally. Use for authentication
url = f'https://adventofcode.com/2025/day/{day}/input'

# Read puzzle input from cache, or fetch and cache it
year = url.split('/')[3]
day = url.split('/')[-2].replace('day', '')
cache_file = f'{year}d{day}.txt'
if os.path.exists(cache_file):
    input_text = open(cache_file).read().strip()
else:
    headers = {'Cookie': f'session={SESSION_COOKIE}'}
    response = requests.get(url, headers=headers)
    input_text = response.text.strip()
    with open(cache_file, 'w') as f:
        f.write(input_text)

current_datetime = datetime.now()

answerp1 = 0
answerp2 = 0
p2Set = set()  # Track all numbers with repeating digit patterns

# Parse comma-separated ranges (e.g., "100-200,500-600")
for nums in input_text.split(','):
    [low, high] = nums.split('-')
    
    # Check each number in the range
    for num in range(int(low), int(high) + 1):
        str_num = str(num)
        length = len(str_num) // 2  # Patterns have max length of half the number
        
        # Try different chunk sizes to see if number is made of repeating patterns
        for j in range(1, length + 1):
            # Only check chunk sizes that evenly divide the number length
            if len(str_num) % j == 0:
                chunk = str_num[:j]  # Get first chunk
                
                # Check if the whole number is a repetition of this chunk
                if chunk * (len(str_num) // j) == str_num:
                    p2Set.add(int(str_num))  # Part 2: any repeating pattern
                    
                    # Part 1: only patterns made of exactly two chunks
                    if len(str_num) // j == 2:
                        answerp1 += int(str_num)

answerp2 = sum(p2Set) # Sum unique numbers for part 2 - 222222 could otherwise be counted multiple times
print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
