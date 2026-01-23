import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipSwordsmanOfTheRealm: CharacterCard = {
  id: "1ov",
  cardType: "character",
  name: "Prince Phillip",
  version: "Swordsman of the Realm",
  fullName: "Prince Phillip - Swordsman of the Realm",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.\nPRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.",
  cost: 7,
  strength: 3,
  willpower: 9,
  lore: 3,
  cardNumber: 83,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "db66d5e6886edfaf68c3a28ff44e4adb2989692d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const princePhillipSwordsmanOfTheRealm: LorcanitoCharacterCard = {
//   id: "yrg",
//   missingTestCase: true,
//   name: "Prince Phillip",
//   title: "Swordsman of the Realm",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**SLAYER OF DRAGONS** When you play this character, banish chosen opposing Dragon character.\n \n**PRESSING THE ADVANTAGE** When he challenges a damaged character, ready this character after the challenge.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Slayer Of Dragons",
//       text: "When you play this character, banish chosen opposing Dragon character.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             ...chosenOpposingCharacter,
//             filters: [
//               ...chosenOpposingCharacter.filters,
//               { filter: "characteristics", value: ["dragon"] },
//             ],
//           },
//         },
//       ],
//     },
//     wheneverChallengesAnotherChar({
//       name: "Pressing the Advantage",
//       text: "When he challenges a damaged character, ready this character after the challenge.",
//       effects: [readyThisCharacter],
//       defenderFilter: [
//         {
//           filter: "status",
//           value: "damage",
//           comparison: { operator: "gt", value: 0 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 3,
//   willpower: 9,
//   lore: 3,
//   illustrator: "Ian MacDonald",
//   number: 83,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561958,
//   },
//   rarity: "super_rare",
// };
//
