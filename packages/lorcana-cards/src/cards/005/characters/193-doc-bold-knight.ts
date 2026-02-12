import type { CharacterCard } from "@tcg/lorcana-types";

export const docBoldKnight: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "discard",
          amount: -1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "1if-1",
      name: "DRASTIC MEASURES",
      text: "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 2,
  externalIds: {
    ravensburger: "c369b0ac1c323d086c86cc6526d0bf193bb7ad88",
  },
  franchise: "Snow White",
  fullName: "Doc - Bold Knight",
  id: "1if",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Doc",
  set: "005",
  strength: 1,
  text: "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.",
  version: "Bold Knight",
  willpower: 3,
};
