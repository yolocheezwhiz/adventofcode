import requests
from datetime import datetime
import os

day = 4
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

answerp1 = 0
answerp2 = 0
ylen = len(lines)
xlen = len(lines[0])

def check_neighbors(x, y):
    if 0 > x or x >= xlen or 0 > y or y >= ylen:
        # Out of bounds
        return 0
    if lines[y][x] != '@':
        # Not a stack
        return 0
    # Is a stack
    return 1

for y in range(ylen):
    for x in range(xlen):
        # Skip if not a stack
        if lines[y][x] != '@':
            continue
        stacks = 0
        stacks += check_neighbors(x - 1, y - 1) # Top-left
        stacks += check_neighbors(x, y - 1) # Top
        stacks += check_neighbors(x + 1, y - 1) # Top-right
        stacks += check_neighbors(x - 1, y) # Left
        stacks += check_neighbors(x + 1, y) # Right
        stacks += check_neighbors(x - 1, y + 1) # Bottom-left
        stacks += check_neighbors(x, y + 1) # Bottom
        stacks += check_neighbors(x + 1, y + 1) # Bottom-right
        if stacks < 4:
            answerp1 += 1

temp = 0
# Part 2: Repeat until no changes
while True:
    for y in range(ylen):
        for x in range(xlen):
            if lines[y][x] != '@':
                continue
            stacks = 0
            stacks += check_neighbors(x - 1, y - 1)
            stacks += check_neighbors(x, y - 1)
            stacks += check_neighbors(x + 1, y - 1)
            stacks += check_neighbors(x - 1, y)
            stacks += check_neighbors(x + 1, y)
            stacks += check_neighbors(x - 1, y + 1)
            stacks += check_neighbors(x, y + 1)
            stacks += check_neighbors(x + 1, y + 1)
            if stacks < 4:
                answerp2 += 1
                # Remove stack
                lines[y] = lines[y][:x] + '.' + lines[y][x+1:]
    # If no stacks were removed, we're done
    if temp == answerp2:
        break
    temp = answerp2
    

print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
