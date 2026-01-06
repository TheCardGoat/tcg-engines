import type { CharacterCard } from "@tcg/lorcana-types";

export const goliathClanLeader: CharacterCard = {
  id: "1uq",
  cardType: "character",
  name: "Goliath",
  version: "Clan Leader",
  fullName: "Goliath - Clan Leader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "f07d182b4a436bccc39687b73bb55f1ffa3fce96",
  },
  abilities: [
    {
      id: "1uq-1",
      name: "DUSK TO DAWN",
      text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        timing: "at",
        on: "ANY_PLAYER",
      },
      effect: {
        type: "sequence",
        steps: [],
      },
    },
    {
      id: "1uq-2",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      condition: {
        type: "if",
        expression: "you have 3 or more cards in your hand",
      },
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Gargoyle"],
};
