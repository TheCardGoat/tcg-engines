import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaLeaderOfHeart: CharacterCard = {
  id: "m5o",
  cardType: "character",
  name: "Raya",
  version: "Leader of Heart",
  fullName: "Raya - Leader of Heart",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.",
  cost: 6,
  strength: 5,
  willpower: 3,
  lore: 2,
  cardNumber: 123,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fdb59ae1c0d5735b0e7fdd135a4f2e4181b4f96",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { damageDealtRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rayaLeaderOfHeart: LorcanitoCharacterCard = {
//   id: "c4z",
//   name: "Raya",
//   title: "Leader of Heart",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Raya.)_\n\n**CHAMPION OF KUMANDRA** Whenever this character challenges a damaged character, she takes no damage from the challenge.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "raya"),
//     wheneverChallengesAnotherChar({
//       name: "CHAMPION OF KUMANDRA",
//       text: "Whenever this character challenges a damaged character, she takes no damage from the challenge.",
//       defenderFilter: [{ filter: "status", value: "damaged" }],
//       effects: [damageDealtRestrictionEffect],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 5,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Amber Kommavongsa",
//   number: 123,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527530,
//   },
//   rarity: "super_rare",
// };
//
