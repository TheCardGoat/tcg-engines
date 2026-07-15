# Game Concepts

Use for players, ownership/control, friendly/enemy status, ready/exhausted
state, resources, costs, damage, power, HP, counters, drawing/discarding,
actions, game state, and information.

## Citations

- `1.1`: General applicability and required game materials.
- `1.2`: Decks, leaders/bases in deckbuilding, tokens, and aspect inclusion.
- `1.3`: Golden rules: comprehensive rules precedence, do as much as possible,
  and restrictions overriding permissions.
- `1.4`: Players, opponents, and active player.
- `1.5`: Cards, ownership/control, friendly/enemy, ready/exhausted, copies,
  out-of-play cards, and card abilities.
- `1.6`: Abilities.
- `1.7`: Resources.
- `1.8`: Costs, resource costs, ability costs, paying costs, additional costs.
- `1.9`: Damage.
- `1.10`: Power.
- `1.11`: HP.
- `1.12`: Counters.
- `1.13`: Drawing cards.
- `1.14`: Discarding cards.
- `1.15`: Actions.
- `1.16`: Game state.
- `1.17`: Open and hidden information.

## Implementation Notes

- Model owner and controller separately; control can change without changing
  damage, upgrades, or ready/exhausted status.
- Treat resources as facedown game objects created from cards, not as a printed
  card type.
- Hidden information choices may legally be made as if fewer options exist.
- Cost payment needs a legality check before payment and a post-payment effect
  boundary so additional costs and reductions are auditable.
