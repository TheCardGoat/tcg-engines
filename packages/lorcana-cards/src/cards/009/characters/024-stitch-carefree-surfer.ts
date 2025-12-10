import type { CharacterCard } from "@tcg/lorcana";

export const stitchCarefreeSurfer: CharacterCard = {
  id: "fir",
  cardType: "character",
  name: "Stitch",
  version: "Carefree Surfer",
  fullName: "Stitch - Carefree Surfer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  cardNumber: 24,
  inkable: true,
  externalIds: {
    ravensburger: "37f056db280fdfb5863b00cac14a30c155046633",
  },
  abilities: [
    {
      id: "fir-1",
      text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      name: "OHANA",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
};
