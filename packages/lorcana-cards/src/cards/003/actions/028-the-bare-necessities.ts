import type { ActionCard } from "@tcg/lorcana-types";

export const theBareNecessities: ActionCard = {
  id: "16d",
  cardType: "action",
  name: "The Bare Necessities",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "003",
  text: "Chosen opponent reveals their hand and discards a non-character card of your choice.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 28,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "987449c640af6e3414a562b19f5b4b29603a7c6d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theBareNecessities: LorcanitoActionCard = {
//   id: "vhx",
//   missingTestCase: true,
//   name: "The Bare Necessities",
//   characteristics: ["action", "song"],
//   text: "Chosen opponent reveals their hand and discards a non-character card of your choice.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         opponentRevealHand,
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["location", "item", "action"] },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//         opponentRevealHand,
//       ],
//     },
//   ],
//   flavour: "Forget about your worries and your strife. . . .",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Maxine Vee / David Navarro Arenas",
//   number: 28,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538224,
//   },
//   rarity: "rare",
// };
//
