import type { CharacterCard } from "@tcg/lorcana-types";

export const princeCharmingProtectorOfTheRealm: CharacterCard = {
  id: "1i3",
  cardType: "character",
  name: "Prince Charming",
  version: "Protector of the Realm",
  fullName: "Prince Charming - Protector of the Realm",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nPROTECTIVE PRESENCE Each turn, only one character can challenge.",
  cost: 7,
  strength: 3,
  willpower: 10,
  lore: 2,
  cardNumber: 189,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c2fc2ba233e86f60234670abac3a03817f461557",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   bodyguardAbility,
//   type PlayerRestrictionStaticAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { eachTurnOnlyOneCharacterCanChallenge } from "@lorcanito/lorcana-engine/effects/effects";
//
// const ability: PlayerRestrictionStaticAbility = {
//   type: "static",
//   ability: "player-restriction",
//   name: "Protective Presence",
//   text: "Each turn, only one character can challenge.",
//   effect: eachTurnOnlyOneCharacterCanChallenge,
// };
//
// export const princeCharmingProtectorOfTheRealm: LorcanitoCharacterCard = {
//   id: "b3q",
//   name: "Prince Charming",
//   title: "Protector of the Realm",
//   characteristics: ["dreamborn", "hero", "prince"],
//   text: "Bodyguard\n\n PROTECTIVE PRESENCE Each turn, only one character can challenge.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 7,
//   strength: 3,
//   willpower: 10,
//   illustrator: "Sara Storino",
//   number: 189,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658343,
//   },
//   rarity: "legendary",
//   abilities: [bodyguardAbility, ability],
//   lore: 2,
// };
//
