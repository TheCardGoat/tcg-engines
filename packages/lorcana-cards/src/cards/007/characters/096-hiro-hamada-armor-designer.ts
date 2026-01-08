import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaArmorDesigner: CharacterCard = {
  id: "zri",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Armor Designer",
  fullName: "Hiro Hamada - Armor Designer",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)\nYOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can’t choose them except to challenge.)",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 96,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "80e5899ff870979d2047e3094ca8c48b56af6ada",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   shiftAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourFloodbornCharsThatHaveACardUnder } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hiroHamadaArmorDesigner: LorcanitoCharacterCard = {
//   id: "ney",
//   name: "Hiro Hamada",
//   title: "Armor Designer",
//   characteristics: ["floodborn", "hero", "inventor"],
//   text: "Shift 5\nYOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Hiro Hamada"),
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "YOU CAN BE WAY MORE",
//       text: "Your Floodborn characters that have a card under them gain Evasive.",
//       gainedAbility: evasiveAbility,
//       target: yourFloodbornCharsThatHaveACardUnder,
//     },
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "YOU CAN BE WAY MORE",
//       text: "Your Floodborn characters that have a card under them gain Ward.",
//       gainedAbility: wardAbility,
//       target: yourFloodbornCharsThatHaveACardUnder,
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald", "sapphire"],
//   cost: 7,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Alan Batson",
//   number: 96,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619457,
//   },
//   rarity: "super_rare",
//   lore: 3,
// };
//
