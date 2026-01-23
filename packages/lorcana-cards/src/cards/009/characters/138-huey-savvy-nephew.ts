import type { CharacterCard } from "@tcg/lorcana-types";

export const hueySavvyNephew: CharacterCard = {
  id: "aka",
  cardType: "character",
  name: "Huey",
  version: "Savvy Nephew",
  fullName: "Huey - Savvy Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nTHREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2612c4d73c23b6a316f7b372373164a6be833e87",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { hueySavvyNephew as hueySavvyNephewAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const hueySavvyNephew: LorcanitoCharacterCard = {
//   ...hueySavvyNephewAsOrig,
//   id: "ksz",
//   reprints: [hueySavvyNephewAsOrig.id],
//   number: 138,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650073,
//   },
// };
//
