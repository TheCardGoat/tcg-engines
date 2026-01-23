import type { CharacterCard } from "@tcg/lorcana-types";

export const bromBonesBurlyBully: CharacterCard = {
  id: "1ai",
  cardType: "character",
  name: "Brom Bones",
  version: "Burly Bully",
  fullName: "Brom Bones - Burly Bully",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "ROUGH AND TUMBLE Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a7a971735b2157f108aa9e53f60ffc6fdda26864",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { eachOpponentLosesLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const bromBonesBurlyBully: LorcanitoCharacterCard = {
//   id: "oyo",
//   name: "Brom Bones",
//   title: "Burly Bully",
//   characteristics: ["storyborn"],
//   text: "ROUGH AND TUMBLE Whenever this character challenges a character with 2 or less, each opponent loses 1 lore.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Aisha Durmagambetova",
//   number: 127,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660015,
//   },
//   rarity: "common",
//   abilities: [
//     wheneverChallengesAnotherChar({
//       name: "ROUGH AND TUMBLE",
//       text: "Whenever this character challenges a character with 2 or less, each opponent loses 1 lore.",
//       effects: [eachOpponentLosesLore(1)],
//       defenderFilter: [
//         {
//           filter: "attribute",
//           value: "strength",
//           comparison: { operator: "lte", value: 2 },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
