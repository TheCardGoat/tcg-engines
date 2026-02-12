import type { CharacterCard } from "@tcg/lorcana-types";

export const panicImmortalSidekick: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a character named Pain in play",
        },
        then: {
          type: "restriction",
          restriction: "cant-be-challenged",
          target: "SELF",
        },
        type: "conditional",
      },
      id: "1bf-1",
      text: "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
      type: "static",
    },
  ],
  cardNumber: 82,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "aafb256c24b833a261abb2a7d0c962056813d116",
  },
  franchise: "Hercules",
  fullName: "Panic - Immortal Sidekick",
  id: "1bf",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Panic",
  set: "004",
  strength: 3,
  text: "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
  version: "Immortal Sidekick",
  willpower: 3,
};
