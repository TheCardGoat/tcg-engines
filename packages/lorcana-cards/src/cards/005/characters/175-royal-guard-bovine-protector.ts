import type { CharacterCard } from "@tcg/lorcana-types";

export const royalGuardBovineProtector: CharacterCard = {
  id: "yxg",
  cardType: "character",
  name: "Royal Guard",
  version: "Bovine Protector",
  fullName: "Royal Guard - Bovine Protector",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  cost: 4,
  strength: 1,
  willpower: 7,
  lore: 1,
  cardNumber: 175,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "7de3467f13bdd030c58d520d0e1d5f48017d006a",
  },
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const royalGuardBovineProtector: LorcanitoCharacterCard = {
//   id: "dua",
//   name: "Royal Guard",
//   title: "Bovine Protector",
//   characteristics: ["storyborn"],
//   type: "character",
//   flavour: "Hey, I’ve been turned into a cow. Can I go home?",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 1,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Valerio Buonfantino",
//   number: 175,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561476,
//   },
//   rarity: "common",
// };
//
