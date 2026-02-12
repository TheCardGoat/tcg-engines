import type { CharacterCard } from "@tcg/lorcana-types";

export const dopeyKnightApprentice: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have another Knight character in play",
          type: "if",
        },
        then: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "conditional",
      },
      id: "1w8-1",
      name: "STRONGER TOGETHER",
      text: "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 3,
  externalIds: {
    ravensburger: "f677c49becf6b4fbd214ebd4f49bda04509c285d",
  },
  franchise: "Snow White",
  fullName: "Dopey - Knight Apprentice",
  id: "1w8",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Dopey",
  set: "005",
  strength: 2,
  text: "STRONGER TOGETHER When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
  version: "Knight Apprentice",
  willpower: 2,
};
