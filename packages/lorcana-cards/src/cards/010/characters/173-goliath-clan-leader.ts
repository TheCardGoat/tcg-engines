import type { CharacterCard } from "@tcg/lorcana-types";

export const goliathClanLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have 3 or more cards in your hand",
        },
        then: {
          type: "restriction",
          restriction: "cant-ready",
          target: "SELF",
        },
        type: "conditional",
      },
      id: "1uq-2",
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
      type: "action",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Gargoyle"],
  cost: 6,
  externalIds: {
    ravensburger: "f07d182b4a436bccc39687b73bb55f1ffa3fce96",
  },
  franchise: "Gargoyles",
  fullName: "Goliath - Clan Leader",
  id: "1uq",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Goliath",
  set: "010",
  strength: 6,
  text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Clan Leader",
  willpower: 5,
};
