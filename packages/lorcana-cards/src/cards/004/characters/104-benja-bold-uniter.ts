import type { CharacterCard } from "@tcg/lorcana-types";

export const benjaBoldUniter: CharacterCard = {
  id: "1a7",
  cardType: "character",
  name: "Benja",
  version: "Bold Uniter",
  fullName: "Benja - Bold Uniter",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  cardNumber: 104,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "a84c7a80da3213f7af4a8596925fa5ab38ac2f34",
  },
  classifications: ["Storyborn", "Mentor", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const benjaBoldUniter: LorcanitoCharacterCard = {
//   id: "pti",
//   name: "Benja",
//   title: "Bold Uniter",
//   characteristics: ["storyborn", "king", "mentor"],
//   type: "character",
//   flavour: "We must work together to heal the entanglements.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Eri Welli",
//   number: 104,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550589,
//   },
//   rarity: "common",
// };
//
