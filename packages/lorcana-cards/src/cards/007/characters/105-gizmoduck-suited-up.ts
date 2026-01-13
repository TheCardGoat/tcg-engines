import type { CharacterCard } from "@tcg/lorcana-types";

export const gizmoduckSuitedUp: CharacterCard = {
  id: "q1q",
  cardType: "character",
  name: "Gizmoduck",
  version: "Suited Up",
  fullName: "Gizmoduck - Suited Up",
  inkType: ["emerald", "steel"],
  franchise: "Ducktales",
  set: "007",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nBLATHERING BLATHERSKITE This character can challenge ready damaged characters.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5de1016b1e0ec1f3f0b71db04b7c8ad9001d766d",
  },
  abilities: [],
  classifications: ["Storyborn", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const gizmoduckSuitedUp: LorcanitoCharacterCard = {
//   id: "g90",
//   name: "Gizmoduck",
//   title: "Suited Up",
//   characteristics: ["storyborn", "inventor"],
//   text: "Resist +1\nBLATHERING BLATHERSKITE This character can challenge ready damaged characters.",
//   type: "character",
//   abilities: [
//     resistAbility(1),
//     {
//       type: "static",
//       ability: "challenge-ready-damaged-chars",
//       name: "BLATHERING BLATHERSKITE",
//       text: "This character can challenge ready damaged characters.",
//     },
//   ],
//   inkwell: true,
//
//   colors: ["emerald", "steel"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Cam Kendell",
//   number: 105,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619463,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
