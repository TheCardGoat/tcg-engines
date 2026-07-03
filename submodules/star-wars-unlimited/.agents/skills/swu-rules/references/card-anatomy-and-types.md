# Card Anatomy And Types

Use for printed attributes, card-type behavior, leader deployment, unit arenas,
upgrades, and tokens.

## Citations

- `2.1`: Card anatomy overview.
- `2.2`-`2.14`: Name, subtitle, type, arena type, cost, aspects, power, power
  modifier, HP, HP modifier, traits, text box, and credit line.
- `3.1`: General card type rules.
- `3.2`: Base.
- `3.3`: Event.
- `3.4`: Leader and leader unit behavior.
- `3.5`: Unit.
- `3.6`: Upgrade.
- `3.7`: Token.

## Implementation Notes

- Keep printed metadata distinct from derived or modified attributes.
- Leaders need both undeployed leader state and deployed leader-unit state.
- Upgrades are controlled independently from the unit they are attached to.
- Token behavior must remove invalid token objects when they leave legal zones.
