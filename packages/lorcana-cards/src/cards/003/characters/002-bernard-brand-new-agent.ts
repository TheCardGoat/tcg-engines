import type { CharacterCard } from "@tcg/lorcana-types";

export const bernardBrandnewAgent: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "ready",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "15t-1",
      text: "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
      type: "action",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "96b509ea25a2dc6814d5ceedc225139dfbfaf703",
  },
  franchise: "Rescuers",
  fullName: "Bernard - Brand-New Agent",
  id: "15t",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Bernard",
  set: "003",
  strength: 1,
  text: "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
  version: "Brand-New Agent",
  willpower: 5,
};
