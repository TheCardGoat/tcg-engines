import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraBandOfPirates: CharacterCard = {
  id: "15r",
  cardType: "character",
  name: "Kakamora",
  version: "Band of Pirates",
  fullName: "Kakamora - Band of Pirates",
  inkType: ["steel"],
  franchise: "Moana",
  set: "007",
  text: "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3. (While challenging, this character gets +3 {S}.)",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 1,
  cardNumber: 192,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "968fb5547e711a20578bb568ded5ae7b8bffbf73",
  },
  abilities: [],
  classifications: ["Storyborn", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const kakamoraBandOfPirates: LorcanitoCharacterCard = {
//   id: "xkp",
//   name: "Kakamora",
//   title: "Band of Pirates",
//   characteristics: ["storyborn", "pirate"],
//   text: "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3.",
//   type: "character",
//   abilities: [
//     whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains({
//       name: "SHOWBOATING",
//       text: "While you have another Pirate character in play, this character gains Challenger +3.",
//       characteristics: ["pirate"],
//       ability: challengerAbility(3),
//     }),
//   ],
//   illustrator: "Juan Diego Leon",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   lore: 1,
//   strength: 1,
//   willpower: 6,
//   number: 192,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619518,
//   },
//   rarity: "common",
// };
//
