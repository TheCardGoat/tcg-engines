import type { ItemCard } from "@tcg/lorcana-types";

export const plasmaBlaster: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      id: "vmw-1",
      name: "QUICK SHOT",
      text: "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 204,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "7204a43d0ddbf91326f601cd9fbef27e72eae9fa",
  },
  franchise: "Lilo and Stitch",
  id: "vmw",
  inkType: ["steel"],
  inkable: false,
  name: "Plasma Blaster",
  set: "001",
  text: "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const chosenCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// Const quickShot: ActivatedAbility = {
//   Type: "activated",
//   Name: "Quick Shot",
//   Text: "Deal 1 damage to chosen character.",
//   Optional: false,
//   Effects: [
//     {
//       Type: "damage",
//       Amount: 1,
//       Target: chosenCharacter,
//     },
//   ],
//   Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
// };
//
// Export const plasmaBlaster: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "t4y",
//   Name: "Plasma Blaster",
//   Text: "**QUICK SHOT** {E}, 2 {I} − Deal 1 damage to chosen character.",
//   Type: "item",
//   Abilities: [quickShot],
//   Flavour:
//     "You don't have to say 'pew pew' when you use it, but it doesn't hurt. \n−Lilo, galactic hero",
//   Colors: ["steel"],
//   Cost: 3,
//   Number: 204,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508929,
//   },
//   Rarity: "rare",
//   Illustrator: "TBD",
// };
//
