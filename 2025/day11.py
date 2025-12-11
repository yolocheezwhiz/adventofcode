import requests
import os
from datetime import datetime

day = 11
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

# Build graph of connected nodes
class Node:
    def __init__(self, name):
        self.name = name
        self.connections = []

nodes = {}
# Parse input
for line in lines:
    _split = line.split(':')
    _from = _split[0]
    _to = _split[1].strip().split(' ')
    # Create source node if it doesn't exist
    if _from not in nodes:
        nodes[_from] = Node(_from)
    # Create destination nodes if not exist
    for device in _to:
        if device not in nodes:
            nodes[device] = Node(device)
        # Link nodes
        nodes[_from].connections.append(nodes[device])

# Part 1: Find all paths from a node to another
def find_paths(start, end):
    # Path found
    if start == end:
        return [[start]]
    # Dead end
    if not start.connections:
        return []
    paths = []
    # Check node's neighbors recursively
    for neighbor in start.connections:
        subpaths = find_paths(neighbor, end)
        for path in subpaths:
            paths.append([start] + path)
    return paths
# Count paths
answerp1 = len(find_paths(nodes['you'], nodes['out']))

# Part 2:
# Use memoization: once we know how many paths exist from node X to 'out' with flags (has_fft, has_dac),
# we can reuse that answer instead of recalculating every time we reach node X again
memo = {}

def count_paths(node, end, has_fft, has_dac):
    # Check if we already computed this
    memo_key = (node.name, has_fft, has_dac)
    if memo_key in memo:
        return memo[memo_key]
    # Update flags if we're at a required node
    if node.name == 'fft':
        has_fft = True
    if node.name == 'dac':
        has_dac = True
    # Path found
    if node == end:
        # Void paths without both flags
        result = 1 if has_fft and has_dac else 0
        # Update memo
        memo[memo_key] = result
        return result
    # Dead end
    if not node.connections:
        # Update memo
        memo[memo_key] = 0
        return 0
    # Sum paths
    count = 0
    for neighbor in node.connections:
        count += count_paths(neighbor, end, has_fft, has_dac)
    memo[memo_key] = count
    return count

answerp2 = count_paths(nodes['svr'], nodes['out'], False, False)

print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
