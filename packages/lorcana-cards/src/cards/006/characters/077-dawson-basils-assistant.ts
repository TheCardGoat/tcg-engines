import type { CharacterCard } from "@tcg/lorcana-types";

export const dawsonBasilsAssistant: CharacterCard = {
  id: "1u8",
  cardType: "character",
  name: "Dawson",
  version: "Basil's Assistant",
  fullName: "Dawson - Basil's Assistant",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "eeb6030bde03db17a4eb97445182172a196ebc72",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const dawsonBasilsAssistant: LorcanitoCharacterCard = {
//   id: "nga",
//   name: "Dawson",
//   title: "Basil's Assistant",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   abilities: [],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Brittney Hackett",
//   number: 77,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591115,
//   },
//   rarity: "common",
// };
//
