import requests
from datetime import datetime
import os

day = 3
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

# Number of joltage digits vary for part 1 vs part 2
def solve(digits_length):
    answer = 0
    for bank in lines:
        # Convert bank string to list of integers
        num_bank = [int(d) for d in bank]
        result = ''
        
        for i in range(digits_length):
            # Find the max digit we can use at this position by excluding end of string 
            # e.g. first digit cannot be in last N positions
            # second digit cannot be in last N-1 positions, etc.
            temp = num_bank[:len(num_bank) - (digits_length - 1 - i)]
            # Find max and its index for a given position
            max_num = max(temp)
            max_pos = num_bank.index(max_num)
            result += str(max_num)
            # Slice array to only keep numbers after the chosen one
            num_bank = num_bank[max_pos + 1:]
        answer += int(result)
    return answer

print(f'Answer part 1: {solve(2)}')
print(f'Answer part 2: {solve(12)}')
print(f'Solved in: {datetime.now() - current_datetime}')
