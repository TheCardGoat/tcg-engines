import type { ItemCard } from "@tcg/lorcana-types";

export const shieldOfVirtue: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
      id: "f35-1",
      name: "FIREPROOF",
      text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  cardNumber: 135,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "36603d551c1f7baf9ea15d2dc93a461dbead7c0b",
  },
  franchise: "Sleeping Beauty",
  id: "f35",
  inkType: ["ruby"],
  inkable: true,
  name: "Shield of Virtue",
  set: "001",
  text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
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
// Export const shieldOfVirtue: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "pn4",
//
//   Name: "Shield of Virtue",
//   Text: "**FIREPROOF** {E}, 3 {I} − Ready chosen character. They can't quest for the rest of this turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Fireproof",
//       Text: "Ready chosen character. They can't quest for the rest of this turn.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
//       Effects: readyAndCantQuest(chosenCharacter),
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "Arm thyself with this enchanted Shield of Virtue and this mighty Sword of Truth, for these weapons of righteousness will triumph over evil. \n−Flora",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Illustrator: "Eri Welli",
//   Number: 135,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508789,
//   },
//   Rarity: "uncommon",
// };
//
