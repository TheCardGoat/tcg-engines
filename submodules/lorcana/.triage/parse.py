#!/usr/bin/env python3
"""Parse bug_reports.md markdown table into JSONL."""
import json
import re
import sys
from pathlib import Path

SRC = Path("/Users/wazar/projects/lorcana-simulator/bug_reports.md")
OUT = Path("/Users/wazar/projects/lorcana-simulator/.triage/reports.jsonl")

def unescape(s: str) -> str:
    # Markdown table escapes: \_  \(  \)  \[  \]  \-  \\  \|  \"
    # First handle the doubled backslash quotes inside the JSON context: \\" -> "
    # We do plain unescape: replace common backslashed punctuation.
    out = []
    i = 0
    while i < len(s):
        c = s[i]
        if c == '\\' and i + 1 < len(s):
            nxt = s[i + 1]
            # collapse escape of these characters to the bare character
            if nxt in '_()[]-|"\\#.+*<>`!':
                out.append(nxt)
                i += 2
                continue
        out.append(c)
        i += 1
    return ''.join(out)

def split_row(line: str):
    # Remove leading/trailing pipes & whitespace, then split on un-escaped pipes.
    line = line.rstrip('\n')
    if line.startswith('|'):
        line = line[1:]
    if line.endswith('|'):
        line = line[:-1]
    cells = []
    cur = []
    i = 0
    while i < len(line):
        c = line[i]
        if c == '\\' and i + 1 < len(line):
            cur.append(c)
            cur.append(line[i + 1])
            i += 2
            continue
        if c == '|':
            cells.append(''.join(cur).strip())
            cur = []
            i += 1
            continue
        cur.append(c)
        i += 1
    cells.append(''.join(cur).strip())
    return cells

def main():
    rows = []
    with SRC.open() as f:
        lines = f.readlines()
    # Skip header (line 0) and divider (line 1).
    for line in lines[2:]:
        if not line.strip().startswith('|'):
            continue
        cells = split_row(line)
        if len(cells) < 10:
            continue
        rec = {
            'id': unescape(cells[0]),
            'user_id': unescape(cells[1]),
            'description': unescape(cells[2]).replace('<br/>', '\n'),
            'source': unescape(cells[3]),
            'context_raw': cells[4],
            'created_at': unescape(cells[5]),
            'status': unescape(cells[6]),
            'resolved_at': unescape(cells[7]),
            'resolved_by_id': unescape(cells[8]),
            'resolution_note': unescape(cells[9]),
        }
        ctx_raw = unescape(cells[4]).strip()
        # Strip outer quotes if the entire blob is quoted.
        if ctx_raw.startswith('"') and ctx_raw.endswith('"'):
            ctx_raw = ctx_raw[1:-1]
        # Internal \" was stored as \\" pre-unescape; after unescape it is now \"
        ctx_raw = ctx_raw.replace('\\"', '"')
        try:
            rec['context'] = json.loads(ctx_raw)
        except Exception:
            rec['context'] = {'_raw': ctx_raw}
        rows.append(rec)

    with OUT.open('w') as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
    print(f"Wrote {len(rows)} records to {OUT}")

if __name__ == '__main__':
    main()
