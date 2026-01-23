import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyKnightForADay: CharacterCard = {
  id: "uft",
  cardType: "character",
  name: "Goofy",
  version: "Knight for a Day",
  fullName: "Goofy - Knight for a Day",
  inkType: ["steel"],
  set: "002",
  cost: 9,
  strength: 10,
  willpower: 10,
  lore: 4,
  cardNumber: 180,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "6db4cfeb86203d0a9247630bfbebe786bd291e09",
  },
  classifications: ["Dreamborn", "Hero", "Knight"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const goofyKnightForADay: LorcanitoCharacterCard = {
//   id: "u0j",
//   name: "Goofy",
//   title: "Knight for a Day",
//   characteristics: ["hero", "dreamborn", "knight"],
//   type: "character",
//   flavour:
//     "It's a banner day for Sir Goofy, who is steeled to prove his mettle against anyone courting trouble−joust in case.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 9,
//   strength: 10,
//   willpower: 10,
//   lore: 4,
//   illustrator: "Marco Giorgianni",
//   number: 180,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 524364,
//   },
//   rarity: "rare",
// };
//
