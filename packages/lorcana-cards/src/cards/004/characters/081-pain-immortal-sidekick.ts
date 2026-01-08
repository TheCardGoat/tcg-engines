import type { CharacterCard } from "@tcg/lorcana-types";

export const painImmortalSidekick: CharacterCard = {
  id: "xpi",
  cardType: "character",
  name: "Pain",
  version: "Immortal Sidekick",
  fullName: "Pain - Immortal Sidekick",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 81,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "797d53a1d137f1aceec58731bc57f609481fbbf4",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const painImmortalSidekick: LorcanitoCharacterCard = {
//   id: "yj2",
//   name: "Pain",
//   title: "Immortal Sidekick",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "We totally took care of that thing you told us to do and definitely did not spend the day in Thebes ticketing chariots and stealing people's laundry.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Oggy Christiansson",
//   number: 81,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550578,
//   },
//   rarity: "uncommon",
// };
//
