import requests
from datetime import datetime
import os
import math
import itertools

day = 8
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
lines = input_text.split('\n')
edges_and_distances = {}
# Parse lines
for i in range(len(lines)):
    lines[i] = list(map(int, lines[i].split(',')))
# Calculate distances between coordinates
for i in range(len(lines) - 1):
    # Avoid duplicate calculations and self comparisons 
    # by making sure second element is always after first element in the array
    for j in range(len(lines) - 1 - i):
        first = lines[i]
        second = lines[j + i + 1]
        distance = math.sqrt(
            (first[0] - second[0]) ** 2 
            + (first[1] - second[1]) ** 2 
            + (first[2] - second[2]) ** 2)
        # Store in object {"pos1_index,pos2_index": distance }
        edges_and_distances[str(i)+','+str(j + i + 1)] = distance
# Sort by distance
sorted_edges_and_distances = dict(sorted(edges_and_distances.items(), key=lambda item: item[1]))
# Key top N elements (shortest distances)
N = 1000
top_values = dict(list(itertools.islice(sorted_edges_and_distances.items(), N)))
# Split stringified pos_index tuples into single_pos_index values
top_keys_split = [key.split(',') for key in top_values.keys()]
# Build clusters
clusters = [{k1, k2} for [k1, k2] in top_keys_split]

while True:
    prev_count = len(clusters)
    new_clusters = []
    # Compare clusters to one another
    # If a pos exists in another cluster, merge the clusters
    for cluster in clusters:
        for existing in new_clusters:
            if cluster & existing:
                existing.update(cluster)
                break
        else:
            new_clusters.append(cluster)
    clusters = new_clusters
    # Loop until clusters stop mutating
    if len(clusters) == prev_count:
        break
# Sort the output by cluster length descending, keep the top 3 elements
sorted_lengths = sorted([len(cluster) for cluster in clusters], reverse=True)[:3]
# Multiply lengths together
print(f'Answer part 1: {math.prod(sorted_lengths)}')
# Part 2: Start by re-using {"pos1_index,pos2_index": distance } edges_and_distancesect sorted by distance from Part 1
connections = sorted_edges_and_distances.keys()
target_cluster_size = len(lines)
clusters = []
last_connection = None
# Similar to Part 1, we want to join clusters together. 
# Difference is that we will merge clusters one by one
for connection in connections:
    k1, k2 = map(int, connection.split(','))
    clusters.append({k1, k2})
    # Loop until clusters stop mutating
    while True:
        new_clusters = []
        for cluster in clusters:
            for existing in new_clusters:
                if cluster & existing:
                    existing.update(cluster)
                    break
            else:
                new_clusters.append(cluster)
        clusters = new_clusters
        if len(new_clusters) == len(clusters):
            break
    # We break when we have a single cluster that contains all coordinates
    if len(clusters) == 1 and len(clusters[0]) == target_cluster_size:
        last_connection = connection
        break
# We convert the last connection into coordinates
[i1, i2] = map(int, last_connection.split(','))
pos1 = lines[i1]
pos2 = lines[i2]
# Extract and multiply together the X coordinates
print(f'Answer part 2: {pos1[0] * pos2[0]}')
print(f'Solved in: {datetime.now() - current_datetime}')
