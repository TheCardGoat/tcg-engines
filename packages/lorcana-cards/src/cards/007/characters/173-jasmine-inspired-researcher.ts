import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineInspiredResearcher: CharacterCard = {
  id: "4mp",
  cardType: "character",
  name: "Jasmine",
  version: "Inspired Researcher",
  fullName: "Jasmine - Inspired Researcher",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 173,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "10b04e532f811271010fabf5d712bcce0f547d7a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jasmineInspiredResearcher: LorcanitoCharacterCard = {
//   id: "i0v",
//   name: "Jasmine",
//   title: "Inspired Researcher",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "EXTRA ASSISTANCE",
//       text: "Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
//       conditions: [
//         {
//           type: "hand",
//           amount: 0,
//           player: "self",
//         },
//       ],
//       effects: [
//         drawXCards({
//           dynamic: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             { filter: "characteristics", value: ["ally"] },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: false,
//
//   colors: ["sapphire", "steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   illustrator: "Milica Celtikovic",
//   number: 173,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619505,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
