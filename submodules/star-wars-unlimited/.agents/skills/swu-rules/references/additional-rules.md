# Additional Rules

Use for special terms and interactions that often drive card behavior edge
cases.

## Citations

- `8.1`: Aspect penalty.
- `8.2`: "Attacks and defeats".
- `8.3`: Attribute.
- `8.4`: "Can" and "can't".
- `8.5`: Choose.
- `8.6`: Copy.
- `8.7`: Empty deck.
- `8.8`: Enter play.
- `8.9`: First.
- `8.10`: "If you do".
- `8.11`: Ignore.
- `8.12`: Last known information.
- `8.13`: Leave play.
- `8.14`: Look at.
- `8.15`: Lose / loses.
- `8.16`: Modifiers.
- `8.17`: "Must".
- `8.18`: Name a card.
- `8.19`: Other / another.
- `8.20`: Play restrictions.
- `8.21`: Prevent damage.
- `8.22`: Printed.
- `8.23`: Random.
- `8.24`: Referential abilities.
- `8.25`: Return.
- `8.26`: Reveal.
- `8.27`: Search.
- `8.28`: Take control.
- `8.29`: "Then".
- `8.30`: Unique / unique icon.
- `8.31`: Up to X.
- `8.32`: You.
- `8.33`: "You may".
- `8.34`: Capture.
- `8.35`: "For each".

## Implementation Notes

- Aspect penalty belongs in play-cost calculation, not card definition metadata.
- `Then` and `If you do` need explicit sequencing and dependency modeling.
- Search/reveal/look-at effects must preserve hidden-information visibility.
- Control-change effects do not reset damage, upgrades, or ready/exhausted state
  unless the effect says so.
- Unique checks should use the official unique-name/subtitle identity rules.
