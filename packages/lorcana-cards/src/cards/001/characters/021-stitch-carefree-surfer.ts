import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchCarefreeSurfer: CharacterCard = {
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
      id: "jzu-1",
      type: "triggered",
      name: "OHANA",
      text: "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "play",
          player: "you",
          cardType: "character",
          comparison: {
            operator: ">=",
            value: 3,
            excludeSelf: true,
          },
        },
        then: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          chooser: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Alien"],
};
