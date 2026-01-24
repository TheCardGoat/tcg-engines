import type { CharacterCard } from "@tcg/lorcana-types";

export const docBoldKnight: CharacterCard = {
  id: "1if",
  cardType: "character",
  name: "Doc",
  version: "Bold Knight",
  fullName: "Doc - Bold Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 193,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c369b0ac1c323d086c86cc6526d0bf193bb7ad88",
  },
  abilities: [
    {
      id: "1if-1",
      type: "triggered",
      name: "DRASTIC MEASURES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: -1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};
