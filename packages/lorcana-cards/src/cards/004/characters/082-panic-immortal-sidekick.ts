import type { CharacterCard } from "@tcg/lorcana-types";

export const panicImmortalSidekick: CharacterCard = {
  id: "1bf",
  cardType: "character",
  name: "Panic",
  version: "Immortal Sidekick",
  fullName: "Panic - Immortal Sidekick",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aafb256c24b833a261abb2a7d0c962056813d116",
  },
  abilities: [
    {
      id: "1bf-1",
      type: "static",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Pain in play",
        },
        then: {
          type: "restriction",
          restriction: "cant-be-challenged",
          target: "SELF",
        },
      },
      text: "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
