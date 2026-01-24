import type { CharacterCard } from "@tcg/lorcana-types";

export const dopeyKnightApprentice: CharacterCard = {
  id: "1w8",
  cardType: "character",
  name: "Dopey",
  version: "Knight Apprentice",
  fullName: "Dopey - Knight Apprentice",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f677c49becf6b4fbd214ebd4f49bda04509c285d",
  },
  abilities: [
    {
      id: "1w8-1",
      type: "triggered",
      name: "STRONGER TOGETHER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have another Knight character in play",
        },
        then: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};
