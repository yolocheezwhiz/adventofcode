import requests
from datetime import datetime
import os

day = 1
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

lines = input_text.split('\n')
current_datetime = datetime.now()

answer_p1 = 0
answer_p2 = 0
pos = 50

for line in lines:
    dir = line[0:1]
    length = int(line[1:])
    previous = pos
    
    if dir == 'R': 
        pos += length
    else:
        pos -= length
    
    # Part 1: count how many times we land on 00
    if pos % 100 == 0:
        answer_p1 += 1

    # Part 2: Compare hundreds digits and add difference to answer as it means we crossed 00
    prev_hundreds = previous // 100
    curr_hundreds = pos // 100
    hundreds_diff = abs(curr_hundreds - prev_hundreds)
    answer_p2 += hundreds_diff
    
    if dir == 'L':
        # Moving left: add 1 if landing exactly on 00, but...
        if pos % 100 == 0:
            answer_p2 += 1
        # ... if we move left on the next turn, we account for the overcounting 
        # e.g. 100 to 99 (1 to 0 hundreds) does not cross a hundred boundary 
        # since we already counted 100 on the previous turn
        if previous % 100 == 0:
            answer_p2 -= 1
print(f'Answer part 1: {answer_p1}')
print(f'Answer part 2: {answer_p2}')
print(f'Solved in: {datetime.now() - current_datetime}')
