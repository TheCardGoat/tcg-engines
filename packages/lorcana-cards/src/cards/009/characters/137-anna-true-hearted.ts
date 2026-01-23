import type { CharacterCard } from "@tcg/lorcana-types";

export const annaTruehearted: CharacterCard = {
  id: "1qm",
  cardType: "character",
  name: "Anna",
  version: "True-Hearted",
  fullName: "Anna - True-Hearted",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 137,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e1b3cea0cee4d2729aad03d87771e607533f1d94",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Queen", "Knight"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { annaTrueHearted as annaTrueheartedAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/138-anna-true-hearted";
//
// export const annaTruehearted: LorcanitoCharacterCard = {
//   ...annaTrueheartedAsOrig,
//   id: "p5i",
//   reprints: [annaTrueheartedAsOrig.id],
//   number: 137,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650072,
//   },
// };
//
