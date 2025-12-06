import requests
from datetime import datetime
import os
import re
import math

day = 6
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

lines = input_text.split('\n')

# Part 1: Just split at and remove white spaces
l0, l1, l2, l3 = [list(map(int, re.split(r'\s+', line))) for line in lines[:4]]
l4 = re.split(r'\s+', lines[4])

# Then add or multiply based on the operator line
for i in range(len(l4)):
    if l4[i] == '+':
        answerp1 += l0[i] + l1[i] + l2[i] + l3[i]
    else:
        answerp1 += l0[i] * l1[i] * l2[i] * l3[i]

# Part 2: White space length is significant
# Use operator line's non empty positions to determine split points
split_points = [m.start() for m in re.finditer(r'\S', lines[4])]
split_points.append(len(lines[3]))  # Add end of line as last split point

# Process each segment
for i in range(len(split_points) - 1):
    arr = []
    start = split_points[i]
    end = split_points[i + 1]
    # Process each character position of each segment
    for j in range(start, end):
        # Build number from all four lines, stripping spaces and converting to int
        # If empty, treat as 0
        num = int((lines[0][j] + lines[1][j] + lines[2][j] + lines[3][j]).strip() or '0')
        # Only consider positive numbers since the 0 would void multiplication
        if num > 0:
            arr.append(num)
    if lines[4][start] == '+':
        answerp2 += sum(arr)
    else:
        answerp2 += math.prod(arr)

print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
