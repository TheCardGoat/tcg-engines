import type { ItemCard } from "@tcg/lorcana-types";

export const coconutBasketundefined: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "d2s-1",
      text: "**TREAT** You may remove up to 3 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Coconut Basket - undefined",
  id: "hoh",
  inkType: ["sapphire"],
  inkable: true,
  name: "Coconut Basket",
  set: "001",
  text: "**CONSIDER THE COCONUT** Whenever you play a character,\ryou may remove up to 2 damage from chosen character.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const coconutbasket: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "hoh",
//   Reprints: ["bxv"],
//
//   Name: "Coconut Basket",
//   Text: "**CONSIDER THE COCONUT** Whenever you play a character,\ryou may remove up to 2 damage from chosen character.",
//   Type: "item",
//   Abilities: [
//     WheneverTargetPlays({
//       Optional: true,
//       Name: "Consider the Coconut",
//       Text: "Whenever you play a character, you may remove up to 2 damage from chosen character.",
//       TriggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//       ],
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 2,
//           UpTo: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "The coconut is a versatile gift from the gods, used to make nearly everything - including baskets to carry more coconuts.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Illustrator: "Milica Celikovic",
//   Number: 166,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493482,
//   },
//   Rarity: "uncommon",
// };
//
