import type { ItemCard } from "@tcg/lorcana-types";

export const eyeOfTheFates: ItemCard = {
  id: "dun",
  cardType: "item",
  name: "Eye of the Fates",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
  cost: 4,
  cardNumber: 167,
  inkable: true,
  externalIds: {
    ravensburger: "31ec2dd1c4e99314e1f758de9ca87d581629a5a9",
  },
  abilities: [
    {
      id: "dun-1",
      text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
      name: "SEE THE FUTURE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterGetLoreThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const eyeOfTheFate: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "jgm",
//
//   name: "Eye of the Fates",
//   text: "**SEE THE FUTURE** {E} − Chosen character gets +1 {L} this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "See the Future",
//       text: "Chosen character gets +1 {L} this turn.",
//       costs: [{ type: "exert" }],
//       effects: [chosenCharacterGetLoreThisTurn(1)],
//     } as ActivatedAbility,
//   ],
//   flavour: "You can change the future once you know what you're looking at.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Ron Baird",
//   number: 167,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508825,
//   },
//   rarity: "uncommon",
// };
//
