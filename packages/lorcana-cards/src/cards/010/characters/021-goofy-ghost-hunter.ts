import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGhostHunter: CharacterCard = {
  id: "1mg",
  cardType: "character",
  name: "Goofy",
  version: "Ghost Hunter",
  fullName: "Goofy - Ghost Hunter",
  inkType: ["amber"],
  set: "010",
  text: "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 21,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2a4c2dc83f092d2a37f6908c3388b21260ad73d",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { chosenOpposingCharacterLoseStrengthUntilNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goofyGhostHunter: LorcanitoCharacterCard = {
//   id: "vb6",
//   name: "Goofy",
//   title: "Ghost Hunter",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "THE PERFECT TRAP When you play this character, choose an opposing character that gets -1 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "THE PERFECT TRAP",
//       text: "When you play this character, choose an opposing character that gets -1 {S} until the start of your next turn.",
//       effects: [chosenOpposingCharacterLoseStrengthUntilNextTurn(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Janel Reh",
//   number: 21,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660358,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
