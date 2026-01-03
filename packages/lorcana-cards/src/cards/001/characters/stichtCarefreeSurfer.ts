import type { CharacterCard } from "@tcg/lorcana-types";

export const StitchCarefreeSurfer: CharacterCard = {
  id: "jzu",
  cardType: "character",
  name: "Stitch",
  version: "Carefree Surfer",
  fullName: "Stitch - Carefree Surfer",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  cardNumber: 21,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      id: "jzu-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 2 or more other characters in play",
        },
        then: {
          type: "draw",
          text: "**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
          id: "jzu-2",
          amount: 2,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Alien"],
};
