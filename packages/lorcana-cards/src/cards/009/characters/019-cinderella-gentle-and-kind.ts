import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaGentleAndKind: CharacterCard = {
  id: "14u",
  cardType: "character",
  name: "Cinderella",
  version: "Gentle and Kind",
  fullName: "Cinderella - Gentle and Kind",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "009",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nA WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "933453208f4cab4b5eacd5391db6a6cf95b7e691",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { cinderellaGentleAndKind as ogCinderellaGentleAndKind } from "@lorcanito/lorcana-engine/cards/001/characters/003-cinderella-gentle-and-kind";
//
// export const cinderellaGentleAndKind: LorcanitoCharacterCard = {
//   ...ogCinderellaGentleAndKind,
//   id: "xks",
//   reprints: [ogCinderellaGentleAndKind.id],
//   number: 19,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649967,
//   },
// };
//
