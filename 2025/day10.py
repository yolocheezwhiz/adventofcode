import requests
import os
from datetime import datetime
from ortools.linear_solver import pywraplp

day = 10
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

# Part 1:
# We never need to press a button twice as it would just reset whatever happened on the first press
# For each button, we try both options (pressing it and not pressing it)
def recurse(button_state, current_button_presses, i):
    global min_button_presses
    # No more buttons to press
    if i == buttons_qty:
        return 
    # Already found a better or equivalent solution
    if current_button_presses + 1 >= min_button_presses:
        return
    # Skip pressing button[i] and try next
    recurse(button_state, current_button_presses, i + 1)
    # Press button[i]
    current_button_presses += 1
    # Change values of each pos that the button modifies
    for pos in buttons[i]:
        if button_state[pos] == '.':
            button_state = button_state[:pos] + '#' + button_state[pos + 1:]
        else:
            button_state = button_state[:pos] + '.' + button_state[pos + 1:]
    # Best solution to date found
    if button_state == goal:
        # Set as new best
        min_button_presses = current_button_presses
        # Kill this branch
        return
    # Try next button
    recurse(button_state, current_button_presses, i + 1)

# Part 2: We need a mathematical solution as it otherwise is too much computation
# After some web searching, this is known as a "Integer linear programming" problem
# Google's OR-Tools for Python seems to be one of the fastest + simplest tool for this
# How to use: https://developers.google.com/optimization/mip/mip_example#basic_steps_for_solving_a_mip_problem
def solvep2():
    # Create solver
    solver = pywraplp.Solver.CreateSolver('SCIP')
    # Decision variables
    x = [solver.IntVar(0, solver.infinity(), f'button_{i}') for i in range(buttons_qty)]
    # Objective
    solver.Minimize(sum(x))
    # Constraints
    for pos in range(len(joltage)):
        contributing_buttons = []
        for button_idx in range(buttons_qty):
            if pos in buttons[button_idx]:
                contributing_buttons.append(x[button_idx])
        solver.Add(sum(contributing_buttons) == joltage[pos])
    # Solve
    solver.Solve()
    return int(sum(var.solution_value() for var in x))

line_num = 0
for line in lines:
    line_num += 1
    min_button_presses = float('inf')
    # Parse line
    goal = line[1:line.index(']')]
    buttons = line[line.index(']') + 2 :line.index('{') - 1].replace('(','').replace(')','').split(' ')
    buttons = [list(map(int, item.split(','))) for item in buttons]
    buttons_qty = len(buttons)
    joltage = line[line.index('{') + 1 :line.index('}')]
    joltage = list(map(int, joltage.split(',')))
    button_state = '.' * len(goal)
    # Evaluate each option
    recurse(button_state, 0, 0)
    # Update answer after each line
    answerp1 += min_button_presses
    answerp2 += solvep2()

print(f'Answer part 1: {answerp1}')
print(f'Answer part 2: {answerp2}')
print(f'Solved in: {datetime.now() - current_datetime}')
