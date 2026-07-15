import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchCarefreeSurfer: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have 2 or more other characters in play",
          type: "if",
        },
        then: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "fir-1",
      name: "OHANA",
      text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Alien"],
  cost: 7,
  externalIds: {
    ravensburger: "37f056db280fdfb5863b00cac14a30c155046633",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Carefree Surfer",
  id: "fir",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Stitch",
  set: "009",
  strength: 4,
  text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  version: "Carefree Surfer",
  willpower: 8,
};
