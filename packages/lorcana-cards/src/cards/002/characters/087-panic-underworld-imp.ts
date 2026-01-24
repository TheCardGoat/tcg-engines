import type { CharacterCard } from "@tcg/lorcana-types";

export const panicUnderworldImp: CharacterCard = {
  id: "1yg",
  cardType: "character",
  name: "Panic",
  version: "Underworld Imp",
  fullName: "Panic - Underworld Imp",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "002",
  text: "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 87,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "fdf450f84ae445d0b49e32dfd310ba191b6790f7",
  },
  abilities: [
    {
      id: "1yg-1",
      type: "triggered",
      name: "I CAN HANDLE IT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "the chosen character is named Pain",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
        },
      },
      text: "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
