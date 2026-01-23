import type { CharacterCard } from "@tcg/lorcana-types";

export const peteSteamboatRival: CharacterCard = {
  id: "nvb",
  cardType: "character",
  name: "Pete",
  version: "Steamboat Rival",
  fullName: "Pete - Steamboat Rival",
  inkType: ["ruby"],
  set: "005",
  text: "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 116,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "560738cc26ab41c3b9302243666e56a60e99e4df",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { banishChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const peteSteamboatRival: LorcanitoCharacterCard = {
//   id: "r5l",
//   name: "Pete",
//   title: "Steamboat Rival",
//   characteristics: ["storyborn", "villain"],
//   text: "**SCRAM!** When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Scram!",
//       text: "When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
//       optional: true,
//       resolutionConditions: [
//         {
//           type: "filter",
//           // He himself counts as 1
//           comparison: { operator: "gt", value: 1 },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "Pete" },
//             },
//           ],
//         },
//       ],
//       effects: [banishChosenOpposingCharacter],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   strength: 6,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Louis Jones",
//   number: 116,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561963,
//   },
//   rarity: "super_rare",
// };
//
