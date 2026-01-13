import type { CharacterCard } from "@tcg/lorcana-types";

export const luckyRuntOfTheLitter: CharacterCard = {
  id: "1qo",
  cardType: "character",
  name: "Lucky",
  version: "Runt of the Litter",
  fullName: "Lucky - Runt of the Litter",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 160,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e1e514a227339f3c439243177d0de9e17bd71e57",
  },
  abilities: [],
  classifications: ["Storyborn", "Puppy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const luckyRuntOfTheLitter: LorcanitoCharacterCard = {
//   id: "tf0",
//   name: "Lucky",
//   title: "Runt of the Litter",
//   characteristics: ["storyborn", "puppy"],
//   text: "FOLLOW MY VOICE Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "FOLLOW MY VOICE",
//       text: "Whenever this character quests, look at the top 2 cards of your deck. You may reveal any number of Puppy character cards and put them in your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 2,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: self,
//           limits: {
//             bottom: 2,
//             inkwell: 0,
//             hand: 2,
//             top: 0,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "characteristics", value: ["puppy"] },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Carlos Luzzi",
//   number: 160,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619498,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
