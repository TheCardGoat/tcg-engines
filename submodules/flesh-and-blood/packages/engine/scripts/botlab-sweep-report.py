#!/usr/bin/env python3
"""Aggregate botlab-sweep shard reports into one matrix summary."""
import glob
import json
import sys
from collections import Counter, defaultdict

shards = []
for path in sorted(glob.glob("reports/botlab-sweep/shard-*.json")):
    with open(path) as f:
        shards.append(json.load(f))

if not shards:
    sys.exit("no shard reports found")

terminations = Counter()
catches = []
per_shard = []
for shard in shards:
    terminations.update(shard["terminations"])
    catches.extend(shard["catches"])
    per_shard.append(f"{shard['shard']}: {shard['matches']} matches in {shard['elapsedS']}s")

total = sum(shard["matches"] for shard in shards)
print(f"matches: {total}")
for line in sorted(per_shard):
    print(f"  {line}")
print(f"terminations: {dict(terminations)}")
print(f"catches: {len(catches)}")

by_termination = defaultdict(list)
for catch in catches:
    by_termination[catch["termination"]].append(catch)
for term, entries in sorted(by_termination.items()):
    print(f"\n=== {term} ({len(entries)}) ===")
    for entry in entries:
        print(
            f"  {entry['label']} seed={entry['seed']} actions={entry['actions']} "
            f"turns={entry['turns']} error={str(entry['error'])[:220]}"
        )
        if entry.get("refusalReport"):
            print(f"    evidence: {entry['refusalReport']}")
