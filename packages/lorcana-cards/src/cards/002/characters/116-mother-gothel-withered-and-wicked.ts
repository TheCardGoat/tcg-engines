import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelWitheredAndWicked: CharacterCard = {
  id: "6fh",
  cardType: "character",
  name: "Mother Gothel",
  version: "Withered and Wicked",
  fullName: "Mother Gothel - Withered and Wicked",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "002",
  text: "WHAT HAVE YOU DONE?! This character enters play with 3 damage.",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 116,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "172cf927696b8d203e6d1c4b97a9f06fe6a3d4f4",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const motherGothelWitheredAndWicked: LorcanitoCharacterCard = {
//   id: "dmj",
//
//   name: "Mother Gothel",
//   title: "Withered and Wicked",
//   characteristics: ["storyborn", "villain"],
//   text: "**WHAT HAVE YOU DONE?!** This character enters play with 3 damage.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "What Have You Done?!",
//       text: "This character enters play with 3 damage.",
//       effects: [
//         {
//           type: "damage",
//           amount: 3,
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Her feelings are written all over her face.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Koni",
//   number: 116,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527253,
//   },
//   rarity: "uncommon",
// };
//
