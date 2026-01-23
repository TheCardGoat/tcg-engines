import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiBumblingRooster: CharacterCard = {
  id: "td9",
  cardType: "character",
  name: "Heihei",
  version: "Bumbling Rooster",
  fullName: "Heihei - Bumbling Rooster",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "009",
  text: "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 86,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69d8809376697e97b2de10221febd0aee79c5d45",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { heiheiBumblingRooster as ogHeiheiBumblingRooster } from "@lorcanito/lorcana-engine/cards/004/characters/075-heihei-bumbling-rooster";
//
// export const heiheiBumblingRooster: LorcanitoCharacterCard = {
//   ...ogHeiheiBumblingRooster,
//   id: "yeh",
//   reprints: ["rmn"],
//   number: 86,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650026,
//   },
// };
//
