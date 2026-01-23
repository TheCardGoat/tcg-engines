import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukLivelyPartner: CharacterCard = {
  id: "1qb",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Lively Partner",
  fullName: "Tuk Tuk - Lively Partner",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.) ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 129,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e0924443108d0df64a23851b0300bc32953f3c15",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { tukTukLivelyPartner as ogTukTukLivelyPartner } from "@lorcanito/lorcana-engine/cards/004/characters/127-tuk-tuk-lively-partner";
//
// export const tukTukLivelyPartner: LorcanitoCharacterCard = {
//   ...ogTukTukLivelyPartner,
//   id: "lts", // New ID for this card
//   reprints: [ogTukTukLivelyPartner.id],
//   number: 129,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650064,
//   },
// };
//
