import type { ItemCard } from "@tcg/lorcana-types";

export const magicGoldenFlower: ItemCard = {
  id: "1dk",
  cardType: "item",
  name: "Magic Golden Flower",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "001",
  text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
  cost: 1,
  cardNumber: 169,
  inkable: true,
  externalIds: {
    ravensburger: "b14e84279a07a659f613dce649d53864d810ff65",
  },
  abilities: [
    {
      id: "1dk-1",
      text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
      name: "HEALING POLLEN",
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
        upTo: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const magicGoldenFlower: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "foq",
//
//   name: "Magic Golden Flower",
//   text: "**HEALING POLLEN** Banish this item - Remove up to 3 damage from chosen character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Healing Pollen",
//       text: "Banish this item - Remove up to 3 damage from chosen character.",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "Once upon a time, a single drop of sunlight fell from the heavens. . . . \n−Flynn Rider",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Cory Godbey",
//   number: 169,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508860,
//   },
//   rarity: "common",
// };
//
