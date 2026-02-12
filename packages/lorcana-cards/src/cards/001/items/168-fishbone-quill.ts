import type { ItemCard } from "@tcg/lorcana-types";

export const fishboneQuill: ItemCard = {
  abilities: [
    {
      effect: {
        facedown: true,
        source: "hand",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "k4a-1",
      text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
      type: "action",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Fishbone Quill - undefined",
  id: "k4a",
  inkType: ["sapphire"],
  inkable: true,
  name: "Fishbone Quill",
  set: "001",
  text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const fishboneQuill: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "k4a",
//   Name: "Fishbone Quill",
//   Text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Go Ahead And Sign",
//       Text: "Put any card from your hand into your inkwell facedown.",
//       Costs: [{ type: "exert" }],
//       IsPrivate: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Exerted: false,
//           IsPrivate: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "If you want to cross the bridge, my sweet, you've got to pay the toll. \n−Ursula",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Number: 168,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508830,
//   },
//   Rarity: "rare",
//   Illustrator: "TBD",
// };
//
