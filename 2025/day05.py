import requests
from datetime import datetime
import os

day = 5
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
answerp2 = 0

# Parse input into ranges and numbers
[range_string, num_string] = input_text.split('\n\n')
# Avoid repeated parsing and int conversion within loops for efficiency
nums = list(map(int, num_string.split('\n'))) 
ranges = [tuple(map(int, range.split('-'))) for range in range_string.split('\n')]

# Part 1
for num in nums: 
    for range in ranges:
        if range[0] <= num <= range[1]:
            answerp1 += 1
            # Avoid inefficiencies and double counting by evaluating each number only once
            break 

# Part 2: Build non-overlapping ranges
# Arguably, we could've looped through ranges first and built a set of nums
# Thus avoiding to loop through ranges again for part 2
# But this is simpler to read and still efficient enough
new_ranges = []
# Sort ranges by start value
# That way we can just compare to the last range in new_ranges
for range in sorted(ranges):
    # Append new range when no overlap
    if not new_ranges or range[0] > new_ranges[-1][1]:
        new_ranges.append(list(range))
    # Merge overlapping ranges
    # We keep the lower bound of the existing range (since ranges are sorted)
    # And just update the upper bound if new value is higher
    else:
        new_ranges[-1][1] = max(new_ranges[-1][1], range[1])

# Sum lengths of non-overlapping ranges
for range in new_ranges:
    answerp2 += range[1] - range[0] + 1

print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
