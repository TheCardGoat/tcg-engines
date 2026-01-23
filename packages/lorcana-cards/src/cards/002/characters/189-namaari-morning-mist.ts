import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariMorningMist: CharacterCard = {
  id: "1dg",
  cardType: "character",
  name: "Namaari",
  version: "Morning Mist",
  fullName: "Namaari - Morning Mist",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 189,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b374629cdd5ecdc326ac5f23af8fd172452f319a",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   bodyguardAbility,
//   challengeReadyCharacters,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const namaariMorningMist: LorcanitoCharacterCard = {
//   id: "mpn",
//
//   name: "Namaari",
//   title: "Morning Mist",
//   characteristics: ["storyborn", "villain", "princess"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**BLADES** This character can challenge ready characters.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     {
//       ...challengeReadyCharacters,
//       name: "Blades",
//       text: "This character can challenge ready characters.",
//     },
//   ],
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Jenna Gray",
//   number: 189,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527640,
//   },
//   rarity: "legendary",
// };
//
