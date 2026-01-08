import type { CharacterCard } from "@tcg/lorcana-types";

export const noiOrphanedThief: CharacterCard = {
  id: "r47",
  cardType: "character",
  name: "Noi",
  version: "Orphaned Thief",
  fullName: "Noi - Orphaned Thief",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 155,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "61bb59a811e9dbf0e06cdf338286eebc8a42ccc6",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   resistAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { itemsYouControl } from "@lorcanito/lorcana-engine/abilities/target";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// const noiWhileCondition: Condition[] = [
//   {
//     type: "filter",
//     filters: itemsYouControl,
//     comparison: {
//       operator: "gte",
//       value: 1,
//     },
//   },
// ];
//
// export const noiOrphanedThief: LorcanitoCharacterCard = {
//   id: "r77",
//   name: "Noi",
//   title: "Orphaned Thief",
//   characteristics: ["storyborn", "ally"],
//   text: "**HIDE AND SEEK** While you have an item in play, this character gains **Resist** +1 and **Ward**. _(Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)_",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGains({
//       name: "HIDE AND SEEK",
//       text: "While you have an item in play, this character gains **Ward**.",
//       conditions: noiWhileCondition,
//       ability: wardAbility,
//     }),
//     whileConditionThisCharacterGains({
//       name: "HIDE AND SEEK",
//       text: " While you have an item in play, this character gains **Resist** +1.",
//       conditions: noiWhileCondition,
//       ability: resistAbility(1),
//     }),
//   ],
//   illustrator: "Kristina Chouri",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   lore: 2,
//   strength: 1,
//   willpower: 2,
//   number: 155,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527766,
//   },
//   rarity: "rare",
// };
//
