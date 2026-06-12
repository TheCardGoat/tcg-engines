# Deckbuilding and RAM

## Contents

- Alpha-kit note
- Deck construction rules
- RAM color limits
- Practical checks

## Alpha-kit note

- Treat the Alpha Kit as a closed-box experience with two fixed decks and no customization.
- Apply the rules below when working on open deckbuilding, deck validation, or future product rules beyond the fixed alpha decks.

## Deck construction rules

- Require exactly 3 Legends.
- Require the 3 Legends to have unique names.
- Require 40 to 50 non-Legend cards in the main deck.
- Allow at most 3 copies of the same card in the deck.

## RAM color limits

- Read the RAM value from each Legend's color-specific RAM limit.
- Add the RAM values of the 3 Legends by color.
- Allow a deck to include a card only if that card's color-specific RAM requirement is less than or equal to the total RAM available in that color.
- Check each color independently. Green Legend RAM raises only the Green limit. Red Legend RAM raises only the Red limit.

Example shape:

- Two Green Legends with 2 Green RAM each create 4 Green RAM total.
- One Red Legend with 2 Red RAM creates 2 Red RAM total.
- That Legend lineup allows Green cards up to 4 RAM and Red cards up to 2 RAM.

## Practical checks

- Validate copy limits separately from RAM limits.
- Validate main-deck size separately from the 3-Legend requirement.
- Avoid assuming a shared colorless RAM pool unless a future source explicitly adds one.
