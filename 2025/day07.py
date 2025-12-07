import requests
from datetime import datetime
import os
from collections import Counter

day = 7
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
lines = input_text.split('\n')

# Part 1:
beams = {lines[0].index('S')}
# Skip every second line (they are empty)
for line in lines[::2]:
    # In part 1 we don't want to overcount beams that overlap, so we use a set
    temp = set()
    for beam in beams:
        if line[beam] == '^':
            # Beam splits
            temp.update([beam - 1, beam + 1])
            answerp1 += 1
        else:
            # Don't forget to add the beam that continues straight
            temp.add(beam)
    beams = temp

# Part 2: We now need to factor in overlapping beams
# But the number of beams grows exponentially, and computing will take forever
# We need to memoize, meaning we still track beams only once
# But we count how often they overlap using a Counter
# For example:
# Suppose a beam is split in two, then later merges back into one
# That 'one' beam is actually two beams overlapping
# So we process it only once
# But when it'll split again, we'll count it as two beams splitting
timelines = Counter([lines[0].index('S')])
for line in lines[::2]:
    temp = Counter()
    for timeline, count in timelines.items():
        if line[timeline] == '^':
            # This is where the magic happens
            # We sum the sum of beams landing on each position
            temp[timeline - 1] += count
            temp[timeline + 1] += count
        else:
            temp[timeline] += count
    timelines = temp
print(f'Part 1: {answerp1}')
# We end up with a count of beams per position. We just need to sum them all
print(f'Part 2: {sum(timelines.values())}')
print(f'Solved in: {datetime.now() - current_datetime}')
