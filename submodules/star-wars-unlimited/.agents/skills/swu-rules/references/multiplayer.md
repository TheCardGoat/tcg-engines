# Multiplayer And Twin Suns

Use for multiplayer, player elimination, and Twin Suns-specific setup/counters.

## Citations

- `11.1`: Multiplayer general rules.
- `11.2`: Multiplayer gameplay overview.
- `11.3`: Player elimination.
- `11.4`: Additional multiplayer clarifications.
- `12.1`: Twin Suns general rules.
- `12.2`: Twin Suns deckbuilding.
- `12.3`: Two leaders.
- `12.4`: Twin Suns setup.
- `12.5`: Twin Suns counters.
- `12.6`: Twin Suns action phase.
- `12.7`: Twin Suns ending the game.

## Implementation Notes

- Current engine work can remain two-player-focused unless a task explicitly
  targets multiplayer.
- Avoid encoding Twin Suns assumptions into base two-player runtime structures.
- Multiplayer visibility, target ownership, and opponent-selection semantics
  should be isolated behind explicit multiplayer support.
