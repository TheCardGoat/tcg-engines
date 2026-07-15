# Abilities And Effects

Use for ability kinds, keyword abilities, triggered abilities, and effect
resolution.

## Citations

- `7.1`: General ability and effect rules.
- `7.2`: Action abilities.
- `7.3`: Constant abilities.
- `7.4`: Event abilities.
- `7.5`: Keyword abilities.
- `7.5.1`: Keywords in general.
- `7.5.2`: Experience token.
- `7.5.3`: Shield token.
- `7.5.4`: Coordinate.
- `7.5.5`: Ambush.
- `7.5.6`: Grit.
- `7.5.7`: Overwhelm.
- `7.5.8`: Raid.
- `7.5.9`: Restore.
- `7.5.10`: Saboteur.
- `7.5.11`: Sentinel.
- `7.5.12`: Shielded.
- `7.5.13`: Bounty.
- `7.5.14`: Smuggle.
- `7.5.15`: Exploit.
- `7.5.16`: Piloting.
- `7.6`: Triggered abilities.
- `7.7`: Effects.

## Implementation Notes

- Represent keyword abilities as executable behavior, not only metadata.
- Multiple keyword instances may stack or not stack depending on the specific
  keyword rule; check the exact keyword section.
- Trigger resolution needs source, controller, timing, optionality, and target
  selection tracked explicitly.
- Event abilities resolve while the event is being played, then the event moves
  according to event card rules.
