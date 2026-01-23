import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodChampionOfSherwood: CharacterCard = {
  id: "1oq",
  cardType: "character",
  name: "Robin Hood",
  version: "Champion of Sherwood",
  fullName: "Robin Hood - Champion of Sherwood",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nSKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.\nTHE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 177,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dae8c3a792a698cb6ccee25e5671d6b03e79414c",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { robinHoodChampionOfSherwood as robinHoodChampionOfSherwoodAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const robinHoodChampionOfSherwood: LorcanitoCharacterCard = {
//   ...robinHoodChampionOfSherwoodAsOrig,
//   id: "mfa",
//   reprints: [robinHoodChampionOfSherwoodAsOrig.id],
//   number: 177,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650110,
//   },
// };
//
