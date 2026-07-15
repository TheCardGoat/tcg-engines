import type { ItemCard } from "@tcg/lorcana-types";

export const eyeOfTheFates: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "dun-1",
      name: "SEE THE FUTURE",
      text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "31ec2dd1c4e99314e1f758de9ca87d581629a5a9",
  },
  franchise: "Hercules",
  id: "dun",
  inkType: ["sapphire"],
  inkable: true,
  name: "Eye of the Fates",
  set: "001",
  text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { chosenCharacterGetLoreThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const eyeOfTheFate: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "jgm",
//
//   Name: "Eye of the Fates",
//   Text: "**SEE THE FUTURE** {E} − Chosen character gets +1 {L} this turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "See the Future",
//       Text: "Chosen character gets +1 {L} this turn.",
//       Costs: [{ type: "exert" }],
//       Effects: [chosenCharacterGetLoreThisTurn(1)],
//     } as ActivatedAbility,
//   ],
//   Flavour: "You can change the future once you know what you're looking at.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Illustrator: "Ron Baird",
//   Number: 167,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508825,
//   },
//   Rarity: "uncommon",
// };
//
