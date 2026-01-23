import type { ItemCard } from "@tcg/lorcana-types";

export const plasmaBlaster: ItemCard = {
  id: "vmw",
  cardType: "item",
  name: "Plasma Blaster",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  text: "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.",
  cost: 3,
  cardNumber: 204,
  inkable: false,
  externalIds: {
    ravensburger: "7204a43d0ddbf91326f601cd9fbef27e72eae9fa",
  },
  abilities: [
    {
      id: "vmw-1",
      text: "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.",
      name: "QUICK SHOT",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// const quickShot: ActivatedAbility = {
//   type: "activated",
//   name: "Quick Shot",
//   text: "Deal 1 damage to chosen character.",
//   optional: false,
//   effects: [
//     {
//       type: "damage",
//       amount: 1,
//       target: chosenCharacter,
//     },
//   ],
//   costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
// };
//
// export const plasmaBlaster: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "t4y",
//   name: "Plasma Blaster",
//   text: "**QUICK SHOT** {E}, 2 {I} − Deal 1 damage to chosen character.",
//   type: "item",
//   abilities: [quickShot],
//   flavour:
//     "You don't have to say 'pew pew' when you use it, but it doesn't hurt. \n−Lilo, galactic hero",
//   colors: ["steel"],
//   cost: 3,
//   number: 204,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508929,
//   },
//   rarity: "rare",
//   illustrator: "TBD",
// };
//
