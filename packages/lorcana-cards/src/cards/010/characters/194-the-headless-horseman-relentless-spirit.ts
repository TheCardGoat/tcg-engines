import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanRelentlessSpirit: CharacterCard = {
  id: "i51",
  cardType: "character",
  name: "The Headless Horseman",
  version: "Relentless Spirit",
  fullName: "The Headless Horseman - Relentless Spirit",
  inkType: ["steel"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  externalIds: {
    ravensburger: "4160bece2c94394d46717dbd1fb2880098079cd6",
  },
  abilities: [
    {
      id: "i51-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const theHeadlessHorsemanRelentlessSpirit: LorcanitoCharacterCard = {
//   id: "cbk",
//   name: "The Headless Horseman",
//   title: "Relentless Spirit",
//   characteristics: ["storyborn", "villain"],
//   text: "Bodyguard",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Cristian Romero",
//   number: 194,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660017,
//   },
//   rarity: "common",
//   abilities: [bodyguardAbility],
//   lore: 1,
// };
//
