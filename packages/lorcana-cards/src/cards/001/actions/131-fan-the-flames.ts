import type { ActionCard } from "@tcg/lorcana-types";

export const fanTheFlames: ActionCard = {
  id: "1eo",
  cardType: "action",
  name: "Fan the Flames",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 131,
  inkable: true,
  externalIds: {
    ravensburger: "b6ae49eb443bf7dcdbb8754463b0144b3c7c183e",
  },
  abilities: [
    {
      id: "1eo-1",
      text: "Ready chosen character. They can't quest for the rest of this turn.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const fanTheFlames: LorcanitoActionCard = {
//   id: "afx",
//   name: "Fan The Flames",
//   characteristics: ["action"],
//   text: "Ready chosen character. They can't quest for the rest of this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Fan The Flames",
//       text: "Ready chosen character. They can't quest for the rest of this turn.",
//       effects: readyAndCantQuest({
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     },
//   ],
//   flavour: "Pretty words can move a crowd, but so can ugly ones.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Jenna Gray",
//   number: 131,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505992,
//   },
//   rarity: "uncommon",
// };
//
