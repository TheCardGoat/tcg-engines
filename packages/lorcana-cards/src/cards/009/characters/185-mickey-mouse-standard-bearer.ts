import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseStandardBearer: CharacterCard = {
  id: "k4b",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Standard Bearer",
  fullName: "Mickey Mouse - Standard Bearer",
  inkType: ["steel"],
  set: "009",
  text: "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 185,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "48839e24171f940246ad8c892880d562b4dcffc4",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mickeyMouseStandardBearer as ogMickeyMouseStandardBearer } from "@lorcanito/lorcana-engine/cards/004/characters/188-mickey-mouse-standard-bearer";
//
// export const mickeyMouseStandardBearer: LorcanitoCharacterCard = {
//   ...ogMickeyMouseStandardBearer,
//   id: "fax", // New ID for this card
//   reprints: [ogMickeyMouseStandardBearer.id],
//   number: 185,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650118,
//   },
// };
//
