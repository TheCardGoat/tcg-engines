import type { CharacterCard } from "@tcg/lorcana-types";

export const cobraBubblesJustASocialWorker: CharacterCard = {
  id: "c86",
  cardType: "character",
  name: "Cobra Bubbles",
  version: "Just a Social Worker",
  fullName: "Cobra Bubbles - Just a Social Worker",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "002",
  cost: 7,
  strength: 5,
  willpower: 9,
  lore: 2,
  cardNumber: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "2c1112f2434eab13dc7e7061e2ab001050dae14f",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const cobraBubblesSimpleEducator: LorcanitoCharacterCard = {
//   id: "ygo",
//   name: "Cobra Bubbles",
//   title: "Just a Social Worker",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "So if I understand correctly, your magic grimoire was washed away by a flood of magic ink?",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 7,
//   strength: 5,
//   willpower: 9,
//   lore: 2,
//   illustrator: "Jake Parker",
//   number: 4,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525118,
//   },
//   rarity: "rare",
// };
//
