import type { CharacterCard } from "@tcg/lorcana-types";

export const petePastryChomper: CharacterCard = {
  id: "1em",
  cardType: "character",
  name: "Pete",
  version: "Pastry Chomper",
  fullName: "Pete - Pastry Chomper",
  inkType: ["ruby"],
  set: "005",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 120,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "b6741a8152956d298a7d5f702a9358f9e22b07d4",
  },
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const petePastryChomper: LorcanitoCharacterCard = {
//   id: "yv6",
//   name: "Pete",
//   title: "Pastry Chomper",
//   characteristics: ["storyborn", "villain"],
//   type: "character",
//   flavour:
//     "His half-baked scheme to whisk away the food almost worked. But in the end, he got his just desserts.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Gaku Kumatori",
//   number: 120,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561638,
//   },
//   rarity: "common",
// };
//
