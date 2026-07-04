# Action Timing

Use for playing cards, attacks, and action abilities.

## Citations

- `6.1`: General action timing.
- `6.2`: Play a card.
- `6.3`: Attack with a unit.
- `6.4`: Use an action ability.

## Implementation Notes

- Playing a card needs legality, cost calculation, payment, zone movement, and
  ability resolution boundaries.
- Attacks require an eligible ready attacker, legal defender/base target,
  attacker exhaustion, attack triggers, combat damage, defeat checks, and
  post-attack cleanup.
- Action abilities require cost payment and prompt/effect resolution through the
  same command boundary as other player actions.
- Triggered abilities that fire during an action should enter the trigger queue
  rather than resolving as ad hoc command side effects.
