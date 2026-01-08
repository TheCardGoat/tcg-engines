import type { CharacterCard } from "@tcg/lorcana-types";

export const sirEctorCastleLord: CharacterCard = {
  id: "zrd",
  cardType: "character",
  name: "Sir Ector",
  version: "Castle Lord",
  fullName: "Sir Ector - Castle Lord",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  cost: 7,
  strength: 7,
  willpower: 10,
  lore: 3,
  cardNumber: 188,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "80e2547ae3c98a93d6ec2ac5deb2e43f6b6be670",
  },
  classifications: ["Storyborn", "Knight"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const sirEctorCastleLord: LorcanitoCharacterCard = {
//   id: "q1j",
//   name: "Sir Ector",
//   title: "Castle Lord",
//   characteristics: ["storyborn", "knight"],
//   type: "character",
//   flavour:
//     "Well, by Jove. Don't just stand there. Raise a glass to my son Kay... and may we be rid of the trickster wizard Marvin, or whatever his blasted name was.",
//   colors: ["steel"],
//   cost: 7,
//   strength: 7,
//   willpower: 10,
//   lore: 3,
//   illustrator: "Brian Weisz",
//   number: 188,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561973,
//   },
//   rarity: "rare",
// };
//
