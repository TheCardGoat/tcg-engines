import type { ItemCard } from "@tcg/lorcana-types";

export const fishboneQuill: ItemCard = {
  id: "k4a",
  cardType: "item",
  name: "Fishbone Quill",
  version: "undefined",
  fullName: "Fishbone Quill - undefined",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
  cost: 3,
  cardNumber: 168,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
      id: "k4a-1",
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "CONTROLLER",
        facedown: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const fishboneQuill: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "k4a",
//   name: "Fishbone Quill",
//   text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Go Ahead And Sign",
//       text: "Put any card from your hand into your inkwell facedown.",
//       costs: [{ type: "exert" }],
//       isPrivate: true,
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: false,
//           isPrivate: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "If you want to cross the bridge, my sweet, you've got to pay the toll. \n−Ursula",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   number: 168,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508830,
//   },
//   rarity: "rare",
//   illustrator: "TBD",
// };
//
