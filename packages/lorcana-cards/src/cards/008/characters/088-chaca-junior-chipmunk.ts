import type { CharacterCard } from "@tcg/lorcana-types";

export const chacaJuniorChipmunk: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a character named Tipo in play",
        },
        then: {
          type: "gain-keyword",
          keyword: "Reckless",
          target: "CHOSEN_CHARACTER",
        },
        type: "conditional",
      },
      id: "mhv-1",
      name: "IN CAHOOTS",
      text: "IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 88,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "5113f29625a5b98f1bd2d747f5ea18e0086cabe0",
  },
  franchise: "Emperors New Groove",
  fullName: "Chaca - Junior Chipmunk",
  id: "mhv",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Chaca",
  set: "008",
  strength: 3,
  text: "IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Junior Chipmunk",
  willpower: 3,
};
