import type { ItemCard } from "@tcg/lorcana-types";

export const magicGoldenFlower: ItemCard = {
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        amount: 3,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
        upTo: true,
      },
      id: "1dk-1",
      name: "HEALING POLLEN",
      text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 169,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "b14e84279a07a659f613dce649d53864d810ff65",
  },
  franchise: "Tangled",
  id: "1dk",
  inkType: ["sapphire"],
  inkable: true,
  name: "Magic Golden Flower",
  set: "001",
  text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const magicGoldenFlower: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "foq",
//
//   Name: "Magic Golden Flower",
//   Text: "**HEALING POLLEN** Banish this item - Remove up to 3 damage from chosen character.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Healing Pollen",
//       Text: "Banish this item - Remove up to 3 damage from chosen character.",
//       Costs: [{ type: "banish" }],
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 3,
//           UpTo: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "Once upon a time, a single drop of sunlight fell from the heavens. . . . \n−Flynn Rider",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 1,
//   Illustrator: "Cory Godbey",
//   Number: 169,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508860,
//   },
//   Rarity: "common",
// };
//
