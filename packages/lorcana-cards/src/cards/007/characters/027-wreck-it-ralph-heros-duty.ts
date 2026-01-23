import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphHerosDuty: CharacterCard = {
  id: "1p2",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Hero's Duty",
  fullName: "Wreck-It Ralph - Hero's Duty",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 1,
  cardNumber: 27,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dec60147f5f6f17659c25d3d2ec4a24dd5c2d35d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const wreckitRalphHerosDuty: LorcanitoCharacterCard = {
//   id: "ehh",
//   name: "Wreck-it Ralph",
//   title: "Hero's Duty",
//   characteristics: ["storyborn", "hero"],
//   text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     whenYourOtherCharactersIsBanished({
//       name: "OUTFLANK",
//       text: "During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
//       conditions: [duringYourTurn],
//       effects: [thisCharacterGetsLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 3,
//   willpower: 8,
//   illustrator: "Erik Wain",
//   number: 27,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619421,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
