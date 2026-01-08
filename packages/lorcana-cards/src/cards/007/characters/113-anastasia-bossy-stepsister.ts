import type { CharacterCard } from "@tcg/lorcana-types";

export const anastasiaBossyStepsister: CharacterCard = {
  id: "6rw",
  cardType: "character",
  name: "Anastasia",
  version: "Bossy Stepsister",
  fullName: "Anastasia - Bossy Stepsister",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "186abcc44c27815f1b4006504346a766d8731138",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const anastasiaBossyStepsister: LorcanitoCharacterCard = {
//   id: "k8t",
//   name: "Anastasia",
//   title: "Bossy Stepsister",
//   characteristics: ["storyborn", "ally"],
//   text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
//   type: "character",
//   abilities: [
//     whenChallenged({
//       name: "OH, I HATE THIS!",
//       text: "Whenever this character is challenged, the challenging player chooses and discards a card.",
//       responder: "opponent",
//       effects: [discardACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 1,
//   illustrator: "Iliana Hidajat",
//   number: 113,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619467,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
