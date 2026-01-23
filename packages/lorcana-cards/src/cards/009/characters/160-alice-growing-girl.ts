import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceGrowingGirl: CharacterCard = {
  id: "1ao",
  cardType: "character",
  name: "Alice",
  version: "Growing Girl",
  fullName: "Alice - Growing Girl",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "GOOD ADVICE Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nWHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a8457457371219443c6138ae91ffc24bee944433",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { aliceGrowingGirl as ogAliceGrowingGirl } from "@lorcanito/lorcana-engine/cards/002/characters/137-alice-growing-girl";
//
// export const aliceGrowingGirl: LorcanitoCharacterCard = {
//   ...ogAliceGrowingGirl,
//   id: "rtw", // New ID for this card
//   reprints: [ogAliceGrowingGirl.id],
//   number: 160,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647672,
//   },
// };
//
