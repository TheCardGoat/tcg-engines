import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierRemarkableGentleman: CharacterCard = {
  id: "xhk",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Remarkable Gentleman",
  fullName: "Dr. Facilier - Remarkable Gentleman",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      id: "xhk-1",
      effect: {
        type: "optional",
        effect: {
          type: "look-at-cards",
          amount: 2,
          from: "top-of-deck",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Sorcerer", "Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const drFacilierRemarkable: LorcanitoCharacterCard = {
//   id: "xhk",
//   name: "Dr. Facilier",
//   title: "Remarkable Gentleman",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["song"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       optional: true,
//       effects: [
//         {
//           type: "scry",
//           amount: 2,
//           mode: "both",
//           limits: {
//             top: 1,
//             inkwell: 0,
//             bottom: 1,
//             hand: 0,
//           },
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Cam Kendell",
//   number: 39,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508727,
//   },
//   rarity: "rare",
// };
//
