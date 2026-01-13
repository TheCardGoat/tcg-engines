import type { LocationCard } from "@tcg/lorcana-types";

export const theBayouMysteriousSwamp: LocationCard = {
  id: "2bw",
  cardType: "location",
  name: "The Bayou",
  version: "Mysterious Swamp",
  fullName: "The Bayou - Mysterious Swamp",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "003",
  text: "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 204,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0866169143a67960533bef9ce3153b052defaa05",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theBayouMysteriousSwamp: LorcanitoLocationCard = {
//   id: "tu0",
//   type: "location",
//   missingTestCase: true,
//   name: "The Bayou",
//   title: "Mysterious Swamp",
//   characteristics: ["location"],
//   text: "**SHOW ME THE WAY** Whenever a character quests while here, you may draw a card, then choose and discard a card.",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Show me the way",
//       text: "Whenever a character quests while here, you may draw a card, then choose and discard a card.",
//       ability: wheneverQuests({
//         ...youMayDrawThenChooseAndDiscard,
//         name: "Show me the way",
//         text: "Whenever a character quests while here, you may draw a card, then choose and discard a card.",
//       }),
//     }),
//   ],
//   flavour: "A place to find what you need, not just what you want.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   willpower: 3,
//   lore: 1,
//   moveCost: 1,
//   illustrator: "Ryan Moeck",
//   number: 204,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538683,
//   },
//   rarity: "uncommon",
// };
//
