import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoMotivationalSpeaker: CharacterCard = {
  id: "15i",
  cardType: "character",
  name: "Rhino",
  version: "Motivational Speaker",
  fullName: "Rhino - Motivational Speaker",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  text: "DESTINY CALLING Your other characters get +2 {W}.",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 1,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "95a56b1f8277a035af9afaaabfaf7215216b4ab9",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { yourOtherCharactersGet } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const rhinoMotivationalSpeaker: LorcanitoCharacterCard = {
//   id: "jwn",
//   name: "Rhino",
//   title: "Motivational Speaker",
//   characteristics: ["storyborn", "ally"],
//   text: "DESTINY CALLING Your other characters get +2 {W}.",
//   type: "character",
//   abilities: [
//     yourOtherCharactersGet({
//       name: "DESTINY CALLING",
//       text: "Your other characters get +2 {W}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "willpower",
//           amount: 2,
//           modifier: "add",
//           target: yourOtherCharacters,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber", "steel"],
//   cost: 6,
//   strength: 4,
//   willpower: 7,
//   illustrator: "Stefano Zanchi",
//   number: 1,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619407,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
