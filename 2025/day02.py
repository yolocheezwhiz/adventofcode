import requests
from datetime import datetime
import os

day = 2
SESSION_COOKIE = open('session_cookie.txt').read().strip()
url = f'https://adventofcode.com/2025/day/{day}/input'

# Read puzzle input from cache, or fetch and cache it
year = url.split('/')[3]
day_num = url.split('/')[-2].replace('day', '')
cache_file = f'{year}d{day_num}.txt'
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
p1Set = set()  # Track patterns repeated exactly 2 times (half+half like 1212, 123123)
p2Set = set()  # Track all repeating patterns (111, 1212, 123123123, etc.)

# Parse comma-separated ranges (e.g., "100-200,500-600")
for nums in input_text.split(','):
    [low_str, high_str] = nums.split('-')
    low_num = int(low_str)
    high_num = int(high_str)
    
    # To avoid too much computation, we generate candidates strategically instead of checking every number
    # For example, suppose range 900-1234
    # For 3-digit numbers (900-999): patterns can only be length-1 repeated 3x
    #   Candidates: 111, 222, 333, ..., 999
    #   Since lower bound is 900, we only need to check: 999
    # For 4-digit numbers (1000-1234): patterns can be length-1 repeated 4x, or length-2 repeated 2x
    #   Length-1 candidates: 1111, 2222, ..., 9999 → only 1111 is in range
    #   Length-2 candidates: 1010, 1111, 1212, ..., 9898 → only 1010, 1111, 1212 are in range (start with 10-12)
    # This approach generates only viable candidates and checks if they're in the actual range

    # For each possible number length in the range (e.g. 900-1234 => lengths [3, 4])
    for length in range(len(low_str), len(high_str) + 1):
        # Try all divisors of the length (these are valid pattern lengths)
        for pattern_len in range(1, length):
            if length % pattern_len == 0:
                repetitions = length // pattern_len
                
                # Determine which pattern prefixes to check based on the range bounds
                # Example: for length=3 in range 900-1234, we check patterns starting with 9
                #          for length=4 in range 900-1234, we check patterns starting with 1
                if len(low_str) == length:
                    # We're checking numbers the same length as the lower bound
                    # Extract the prefix from the lower bound (e.g., "900" → "9" for pattern_len=1)
                    low_prefix = low_str[:pattern_len]
                else:
                    # We're checking numbers longer than the lower bound
                    # Start from the smallest valid pattern (1, 10, 100, etc.)
                    low_prefix = '1' + '0' * (pattern_len - 1)
                
                if len(high_str) == length:
                    # We're checking numbers the same length as the upper bound
                    # Extract the prefix from the upper bound (e.g., "1234" → "12" for pattern_len=2)
                    high_prefix = high_str[:pattern_len]
                else:
                    # We're checking numbers shorter than the upper bound
                    # End at the largest valid pattern (9, 99, 999, etc.)
                    high_prefix = '9' * pattern_len
                
                low_prefix_num = int(low_prefix)
                high_prefix_num = int(high_prefix)
                
                # Generate candidates for all patterns in the prefix range
                for prefix_num in range(low_prefix_num, high_prefix_num + 1):
                    pattern = str(prefix_num).zfill(pattern_len)
                    candidate = int(pattern * repetitions)
                    
                    # Verify the candidate is actually in the range (it might not be due to prefix approximation)
                    if low_num <= candidate <= high_num:
                        p2Set.add(candidate)
                        # Part 1: only patterns repeated exactly 2 times (half+half)
                        if repetitions == 2:
                            p1Set.add(candidate)

answerp1 = sum(p1Set)
answerp2 = sum(p2Set)
print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
