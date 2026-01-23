import type { ItemCard } from "@tcg/lorcana-types";

export const coconutBasketundefined: ItemCard = {
  id: "hoh",
  cardType: "item",
  name: "Coconut Basket",
  version: "undefined",
  fullName: "Coconut Basket - undefined",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**CONSIDER THE COCONUT** Whenever you play a character,\ryou may remove up to 2 damage from chosen character.",
  cost: 2,
  cardNumber: 166,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "d2s-1",
      text: "**TREAT** You may remove up to 3 damage from chosen character.",
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const coconutbasket: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "hoh",
//   reprints: ["bxv"],
//
//   name: "Coconut Basket",
//   text: "**CONSIDER THE COCONUT** Whenever you play a character,\ryou may remove up to 2 damage from chosen character.",
//   type: "item",
//   abilities: [
//     wheneverTargetPlays({
//       optional: true,
//       name: "Consider the Coconut",
//       text: "Whenever you play a character, you may remove up to 2 damage from chosen character.",
//       triggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//       ],
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "The coconut is a versatile gift from the gods, used to make nearly everything - including baskets to carry more coconuts.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Milica Celikovic",
//   number: 166,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493482,
//   },
//   rarity: "uncommon",
// };
//
