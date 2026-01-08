import type { CharacterCard } from "@tcg/lorcana-types";

export const genieExcitedShipbuilder: CharacterCard = {
  id: "185",
  cardType: "character",
  name: "Genie",
  version: "Excited Shipbuilder",
  fullName: "Genie - Excited Shipbuilder",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "9f18aa651926abcab52db9a4fa2d54f330f4e235",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const genieExcitedShipbuilder: LorcanitoCharacterCard = {
//   id: "j9a",
//   name: "Genie",
//   title: "Excited Shipbuilder",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Stefano Zanchi",
//   number: 38,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593006,
//   },
//   rarity: "common",
// };
//
