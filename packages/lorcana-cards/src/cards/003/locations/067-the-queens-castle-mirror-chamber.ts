import type { LocationCard } from "@tcg/lorcana-types";

export const theQueensCastleMirrorChamber: LocationCard = {
  id: "16x",
  cardType: "location",
  name: "The Queen's Castle",
  version: "Mirror Chamber",
  fullName: "The Queen's Castle - Mirror Chamber",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "003",
  text: "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.",
  cost: 4,
  moveCost: 1,
  lore: 0,
  cardNumber: 67,
  inkable: true,
  externalIds: {
    ravensburger: "9ab00d3ccf3aa6a5a6653a6a70340dd4cfdf1666",
  },
  abilities: [
    {
      id: "16x-1",
      type: "action",
      effect: {
        type: "for-each",
        counter: {
          type: "characters",
          controller: "you",
        },
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "USING THE MIRROR At the start of your turn, for each character you have here, you may draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
//
// export const theQueensCastleMirrorChamber: LorcanitoLocationCard = {
//   id: "vbq",
//   type: "location",
//   name: "The Queen's Castle",
//   title: "Mirror Chamber",
//   characteristics: ["location"],
//   text: "**USING THE MIRROR** At the start of your turn, for each character you have here, you may draw a card.",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Using the Mirror",
//       text: "At the start of your turn, for each character you have here, you may draw a card.",
//       optional: true,
//       effects: [
//         // TODO: this effect is not quite right, it's drawing X cards instead of creating X layers that draw 1 card each
//         {
//           type: "draw",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "play" },
//               { filter: "location", value: "source" },
//             ],
//           },
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "Those who visit the mirror can choose their question−but not the answer.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   willpower: 7,
//   lore: 2,
//   moveCost: 1,
//   illustrator: "Matthew Oates",
//   number: 67,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538680,
//   },
//   rarity: "rare",
// };
//
