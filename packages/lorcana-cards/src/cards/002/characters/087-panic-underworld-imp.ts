import type { CharacterCard } from "@tcg/lorcana-types";

export const panicUnderworldImp: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "the chosen character is named Pain",
          type: "if",
        },
        then: {
          modifier: 4,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "1yg-1",
      name: "I CAN HANDLE IT",
      text: "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "fdf450f84ae445d0b49e32dfd310ba191b6790f7",
  },
  franchise: "Hercules",
  fullName: "Panic - Underworld Imp",
  id: "1yg",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Panic",
  set: "002",
  strength: 2,
  text: "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
  version: "Underworld Imp",
  willpower: 3,
};
