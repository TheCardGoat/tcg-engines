import type { CharacterCard } from "@tcg/lorcana-types";

export const panicImmortalSidekick: CharacterCard = {
  id: "1bf",
  cardType: "character",
  name: "Panic",
  version: "Immortal Sidekick",
  fullName: "Panic - Immortal Sidekick",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aafb256c24b833a261abb2a7d0c962056813d116",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
//
// export const panicImmortalSidekick: LorcanitoCharacterCard = {
//   id: "eii",
//   missingTestCase: true,
//   name: "Panic",
//   title: "Immortal Sidekick",
//   characteristics: ["storyborn", "ally"],
//   text: "**REPORTING FOR DUTY** While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Reporting for Duty",
//       text: "While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
//       conditions: [{ type: "exerted" }, ifYouHaveCharacterNamed("Pain")],
//       effects: [
//         {
//           type: "restriction",
//           restriction: "be-challenged",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "We absolutely took care of that thing, boss. No problems, just great.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Oggy Christiansson",
//   number: 82,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550579,
//   },
//   rarity: "uncommon",
// };
//
