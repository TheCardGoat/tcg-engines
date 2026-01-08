import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipWardenOfTheWoods: CharacterCard = {
  id: "1kf",
  cardType: "character",
  name: "Prince Phillip",
  version: "Warden of the Woods",
  fullName: "Prince Phillip - Warden of the Woods",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "SHINING BEACON Your other Hero characters gain Ward. (Opponents can’t choose them except to challenge.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 72,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cb670ebd52463f804846e1f401536397d24fa5ac",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { princePhillipWardenOfTheWoods as ogPrincePhillipWardenOfTheWoods } from "@lorcanito/lorcana-engine/cards/004/characters/088-prince-phillip-warden-of-the-woods";
//
// export const princePhillipWardenOfTheWoods: LorcanitoCharacterCard = {
//   ...ogPrincePhillipWardenOfTheWoods,
//   id: "l8f",
//   reprints: [ogPrincePhillipWardenOfTheWoods.id],
//   number: 72,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650014,
//   },
// };
//
