# Task Log

## Context

- Date: 2026-05-15
- Branch: main

## Problem Statement

Investigate report: Mickey Mouse with "When you play this character and when he leaves play, each opponent chooses and discards a card" appears to trigger when attacking and remaining in play, possibly involving Snow Fort.

## Research

- The discard text maps to `Mickey Mouse - Snowboard Ace` (`packages/lorcana/lorcana-cards/src/cards/011/characters/091-mickey-mouse-snowboard-ace.ts`), not the set 012 Mickey files from the initial report.
- `Mickey Mouse - Expedition Leader` and `Mickey Mouse - Experienced Traveler` do not have discard effects.
- Snow Fort has a known turn-owner-sensitive static condition surface through BARRICADE, so reproduction should include the item.
- Focused engine repros do not reproduce a false SLIPPERY SLOPE trigger when Snowboard Ace attacks and survives, or when Snow Fort's Resist keeps Snowboard Ace in play during an opponent challenge.

## Proposed Solution

Create a focused regression that challenges with Snowboard Ace while Snow Fort is in play and verifies no leave-play discard trigger is queued unless Mickey actually leaves play.

## Status

No engine bug reproduced. Regression coverage added for the reported Snowboard Ace/Snow Fort challenge surfaces.

## Implementation Log

### 2026-05-15

- [x] Created memory-bank log for the Snowboard Ace/Snow Fort attack-trigger report.
- [x] Reproduced the closest card identity: `Mickey Mouse - Snowboard Ace`, not the two set 012 Mickey files.
- [x] Added regression coverage for Snowboard Ace attacking with Snow Fort and remaining in play.
- [x] Added regression coverage for Snow Fort's Resist preventing Snowboard Ace from leaving play during an opponent challenge.
- [x] Ran focused and package validation.
