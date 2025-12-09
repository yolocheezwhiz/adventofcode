import requests
from datetime import datetime
import os

day = 9
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
# Convert string to [x,y] positions
for i in range(len(lines)):
    lines[i] = list(map(int, lines[i].split(',')))

# Part 1:
# Simply calculate the area of each rectangles. Keep max.
for i in range(len(lines) - 1):
    # Avoid duplicate calculations and self comparisons 
    # by making sure second element is always after the first
    for j in range(len(lines) - 1 - i):
        first = lines[i]
        second = lines[j + i + 1]
        answerp1 = max(answerp1, (abs(first[0] - second[0]) + 1) * (abs(first[1] - second[1]) + 1))
print(f'Answer part 1: {answerp1}')

# Part 2:
# Build a set of all coordinates on the polygon's perimeter
perimeter = set()

for i in range(len(lines)):
    [x1, y1] = lines[i]
    [x2, y2] = lines[(i+1) % len(lines)] # Use modulo to wrap last corner with first corner
    if y1 == y2:  # Horizontal line
        for x in range(min(x1, x2), max(x1, x2) + 1):
            perimeter.add((x, y1))
    else:  # Vertical line
        for y in range(min(y1, y2), max(y1, y2) + 1):
            perimeter.add((x1, y))

# Now we can check rectangles
answerp2 = 0
for i in range(len(lines) - 1):
    for j in range(len(lines) - 1 - i):
        [x1, y1] = lines[i]
        [x2, y2] = lines[j + i + 1]
        
        # Calculate area of rectangle
        area = (abs(x1 - x2) + 1) * (abs(y1 - y2) + 1)
        # Skip if this area can't beat our current best, improving performance > 100x
        if area <= answerp2:
            continue
        
        min_x, max_x = min(x1, x2), max(x1, x2)
        min_y, max_y = min(y1, y2), max(y1, y2)

        # This is the counter intuitive portion
        # We do not check if the rectangle overflows outside the polygon
        # We check if any of the polygon's xy pos is strictly inside the rectangle
        found_conflict = False
        for (px, py) in perimeter:
            if min_x < px < max_x and min_y < py < max_y:
                found_conflict = True
                break
        # Rectangle is inside the polygon, and its area is bigger than previous best. Update best.
        if not found_conflict:
            answerp2 = area

print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
