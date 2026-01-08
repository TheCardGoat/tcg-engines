import type { CharacterCard } from "@tcg/lorcana-types";

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
      type: "triggered",
      name: "OHANA",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 2 or more other characters in play",
        },
        then: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
      },
      text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { stichtCarefreeSurfer as ogStichtCarefreeSurfer } from "@lorcanito/lorcana-engine/cards/001/characters/021-stitch-carefree-surfer";
//
// export const stitchCarefreeSurfer: LorcanitoCharacterCard = {
//   ...ogStichtCarefreeSurfer,
//   id: "jdo",
//   reprints: [ogStichtCarefreeSurfer.id],
//   number: 24,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649972,
//   },
// };
//
