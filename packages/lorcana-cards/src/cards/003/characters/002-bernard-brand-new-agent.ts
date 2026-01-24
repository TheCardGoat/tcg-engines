import type { CharacterCard } from "@tcg/lorcana-types";

export const bernardBrandnewAgent: CharacterCard = {
  id: "15t",
  cardType: "character",
  name: "Bernard",
  version: "Brand-New Agent",
  fullName: "Bernard - Brand-New Agent",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  text: "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 2,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "96b509ea25a2dc6814d5ceedc225139dfbfaf703",
  },
  abilities: [
    {
      id: "15t-1",
      type: "action",
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
