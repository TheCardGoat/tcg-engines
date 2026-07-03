# Zones

Use for zone ownership, visibility, movement, in-play/out-of-play status, and
set-aside cards.

## Citations

- `4.1`: General zone rules.
- `4.2`: Base zone.
- `4.3`: Ground arena.
- `4.4`: Space arena.
- `4.5`: Resource zone.
- `4.6`: Deck.
- `4.7`: Hand.
- `4.8`: Discard pile.
- `4.9`: In-play and out-of-play.
- `4.10`: Play area.
- `4.11`: Set aside / being in no zone.

## Implementation Notes

- The ground and space arenas are separate targeting and attack domains.
- Resource-zone cards are hidden information unless a rule or effect reveals
  them.
- Public/private projections must respect hand, deck, resource, and set-aside
  visibility.
- Capture and search effects usually combine zone movement with hidden
  information rules; also load `additional-rules.md`.
