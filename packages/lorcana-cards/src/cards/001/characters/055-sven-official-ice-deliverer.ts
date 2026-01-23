import type { CharacterCard } from "@tcg/lorcana-types";

export const svenOfficialIceDeliverer: CharacterCard = {
  id: "kar",
  cardType: "character",
  name: "Sven",
  version: "Official Ice Deliverer",
  fullName: "Sven - Official Ice Deliverer",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 6,
  strength: 5,
  willpower: 7,
  lore: 1,
  cardNumber: 55,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const svenOficialIceDeliverer: LorcanitoCharacterCard = {
//   id: "kar",
//   reprints: ["tf5"],
//   name: "Sven",
//   title: "Official Ice Deliverer",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "Reindeer comin’ through!\n−Kristoff",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 5,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Jared Nickerl",
//   number: 55,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502010,
//   },
//   rarity: "uncommon",
// };
//
