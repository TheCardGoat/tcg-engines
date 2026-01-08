import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesUnwaveringDemigod: CharacterCard = {
  id: "1n8",
  cardType: "character",
  name: "Hercules",
  version: "Unwavering Demigod",
  fullName: "Hercules - Unwavering Demigod",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 180,
  inkable: true,
  externalIds: {
    ravensburger: "d57ba4914c87d36251c93894e3081d6552322ca0",
  },
  abilities: [
    {
      id: "1n8-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const herculesUnwaveringDemigod: LorcanitoCharacterCard = {
//   id: "f61",
//   name: "Hercules",
//   title: "Unwavering Demigod",
//   characteristics: ["dreamborn", "hero", "prince"],
//   text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
//   type: "character",
//   abilities: [challengerAbility(2)],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Stefano Zanchi",
//   number: 180,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593011,
//   },
//   rarity: "common",
// };
//
