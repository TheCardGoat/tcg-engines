import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleNewsReporter: CharacterCard = {
  id: "1r6",
  cardType: "character",
  name: "Clarabelle",
  version: "News Reporter",
  fullName: "Clarabelle - News Reporter",
  inkType: ["sapphire"],
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBREAKING STORY Your other characters with Support get +1 {S}.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 153,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e3b5dbe6ce01c2ada369d0b5792e10567e35497f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const clarabelleNewsReporter: LorcanitoCharacterCard = {
//   id: "ftn",
//   name: "Clarabelle",
//   title: "News Reporter",
//   characteristics: ["storyborn", "ally"],
//   text: "SUPPORTBREAKING STORY Your other characters with Support gain +1 {S}.",
//   type: "character",
//   abilities: [
//     supportAbility,
//     {
//       type: "static",
//       ability: "effects",
//       name: "BREAKING STORY",
//       text: "Your other characters with Support gain +1 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "ability", value: "support" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Stefano Spagnuolo",
//   number: 153,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618711,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
