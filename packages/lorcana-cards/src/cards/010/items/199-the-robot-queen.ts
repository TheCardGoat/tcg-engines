import type { ItemCard } from "@tcg/lorcana-types";

export const theRobotQueen: ItemCard = {
  id: "n1t",
  cardType: "item",
  name: "The Robot Queen",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
  cost: 1,
  cardNumber: 199,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "53133ab50ca19d277b331206bf608e32ae359deb",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theRobotQueen: LorcanitoItemCard = {
//   id: "xd8",
//   name: "The Robot Queen",
//   characteristics: ["item"],
//   text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {} and banish this item to deal 2 damage to chosen character.",
//   type: "item",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Anne Neyens",
//   number: 199,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658498,
//   },
//   rarity: "uncommon",
//   abilities: [
//     wheneverYouPlayACharacter({
//       name: "Major Malfunction",
//       text: "Whenever you play a character, you may pay 1 {} and banish this item to deal 2 damage to chosen character.",
//       optional: true,
//       costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
//       effects: [dealDamageEffect(2, chosenCharacter)],
//     }),
//   ],
// };
//
