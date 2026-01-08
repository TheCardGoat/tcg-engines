import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukBigBuddy: CharacterCard = {
  id: "19s",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Big Buddy",
  fullName: "Tuk Tuk - Big Buddy",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "a503ad476cccbf9d1686da8dde53a17a5189485c",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const tukTukBigBuddy: LorcanitoCharacterCard = {
//   id: "kxy",
//   name: "Tuk Tuk",
//   title: "Big Buddy",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 6,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Mariana Moreno",
//   number: 184,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593049,
//   },
//   rarity: "uncommon",
// };
//
