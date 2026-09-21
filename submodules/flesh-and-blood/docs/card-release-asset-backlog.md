# Card Release Asset Backlog (ops handoff)

Generated: 2026-09-11 · Source: current `flesh-and-blood-printings.json` after official LSS `/media/cards/large/` ingest from FAB Cube `9fb8c73011311720bc7add61fb8eaab00b131bc3`.

Units affected: 6 · printings with empty URLs: 6 (image: 6, board: 6) · canonical ids with no printing row: 3

These remaining rows have **null `image_url` in the FAB Cube snapshot**. They are
upstream source gaps, not authored defects, and are never hand-patched. Revisit
when Cube publishes the exact printing image.

| set | printings |
| --- | --------- |
| SUP | 4         |
| IAR | 2         |

## Per-printing detail

| set | collector | unit                        | canonicalId           | printingId            | missing     |
| --- | --------- | --------------------------- | --------------------- | --------------------- | ----------- |
| IAR | IAR158    | `tokens/gate-to-i-arathael` | JtkWt6Kzpgz9qpPLPp8Ff | Qg7fRD8gHdgJ9gbqfz7Gg | image+board |
| IAR | IAR158    | `tokens/runechant`          | zfrHQjbPkpBmdQGrWcTMB | cTNqTqBqmKmCQGc6G6qKQ | image+board |
| SUP | SUP239    | `tokens/confidence`         | WBFjTCfmbwHCr8WNmz8RQ | PnFwphnmNcc6tFtT8Pr6z | image+board |
| SUP | SUP240    | `tokens/might`              | 6gqTwGnmHjkCLDqKPWt8c | WPm6RdFLGJLz8kHpfnRPz | image+board |
| SUP | SUP241    | `tokens/toughness`          | Cn8tK9KRm7d9KbcQk6Pqm | mq9tkfcJC6KK6dHddphdw | image+board |
| SUP | SUP242    | `tokens/vigor`              | DBhPCQqjnj6qqd9DtBB7W | BjmjPTj6BGTT9qBw68H8T | image+board |

## Canonical ids with no Cube printing row

Cube admits the identity with an empty `printings` array. Card Vault lists IAR050–052. No official source URL exists to ingest.

| unit                                  | canonicalId           |
| ------------------------------------- | --------------------- |
| `blocks/rise-to-the-challenge` red    | 98CqQctT9798DjgnBQ6Fg |
| `blocks/rise-to-the-challenge` yellow | rqqhfk6QgmJCNkQNGhqNg |
| `blocks/rise-to-the-challenge` blue   | wQNrNhFfjBdkDnQ8QkJqq |
