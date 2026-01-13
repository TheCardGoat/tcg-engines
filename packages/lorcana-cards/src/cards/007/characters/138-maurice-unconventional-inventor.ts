import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceUnconventionalInventor: CharacterCard = {
  id: "sgs",
  cardType: "character",
  name: "Maurice",
  version: "Unconventional Inventor",
  fullName: "Maurice - Unconventional Inventor",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.",
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6698a30b59037423babb442467706c9fb7964d3a",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { chosenCharacterWithStrengthXorLess } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   drawACard,
//   mayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
// import type {
//   BanishEffect,
//   CreateLayerBasedOnTarget,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const afterEffect: CreateLayerBasedOnTarget = {
//   type: "create-layer-based-on-target",
//   effects: [mayBanish(chosenCharacterWithStrengthXorLess(2))],
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "item" },
//       { filter: "owner", value: "self" },
//       {
//         filter: "attribute",
//         value: "name",
//         comparison: { operator: "eq", value: "maurice's machine" },
//       },
//     ],
//   },
// };
//
// const targetingMauricesMachine: BanishEffect = {
//   type: "banish",
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "item" },
//       { filter: "owner", value: "self" },
//       {
//         filter: "attribute",
//         value: "name",
//         comparison: { operator: "eq", value: "maurice's machine" },
//       },
//     ],
//   },
//   forEach: [drawACard],
//   afterEffect: [afterEffect],
// };
//
// const notTargettingMauricesMachine: BanishEffect = {
//   type: "banish",
//   target: chosenItemOfYours,
//   forEach: [drawACard],
// };
//
// const newVar: TargetConditionalEffect = {
//   type: "target-conditional",
//   // move condition to a separate object, so the filter is the same
//   effects: [targetingMauricesMachine],
//   fallback: [notTargettingMauricesMachine],
//   // TODO: Re implement conditional target
//   target: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "type", value: "item" },
//       { filter: "owner", value: "self" },
//       {
//         filter: "attribute",
//         value: "name",
//         comparison: { operator: "eq", value: "maurice's machine" },
//       },
//     ],
//   },
// };
//
// export const mauriceUnconventionalInventor: LorcanitoCharacterCard = {
//   id: "mgt",
//   name: "Maurice",
//   title: "Unconventional Inventor",
//   characteristics: ["storyborn", "mentor", "inventor"],
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 2,
//   illustrator: "Andy Estrada / Greg Shrader",
//   number: 138,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619483,
//   },
//   rarity: "rare",
//   lore: 1,
//   text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice’s Machine, you may also banish chosen character with 2 {S} or less.",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "How on Earth Did That Happen?",
//       text: "When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice’s Machine, you may also banish chosen character with 2 {S} or less.",
//       optional: true,
//       dependentEffects: true,
//       effects: [newVar],
//     }),
//   ],
// };
//
