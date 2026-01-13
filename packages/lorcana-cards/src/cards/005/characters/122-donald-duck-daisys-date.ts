import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckDaisysDate: CharacterCard = {
  id: "1d9",
  cardType: "character",
  name: "Donald Duck",
  version: "Daisy's Date",
  fullName: "Donald Duck - Daisy's Date",
  inkType: ["ruby"],
  set: "005",
  text: "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 122,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b19631e75285a54e5b0d403510612154cb7cd88f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { eachOpponentLosesXLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const donaldDuckDaisysDate: LorcanitoCharacterCard = {
//   id: "thl",
//   name: "Donald Duck",
//   title: "Daisy's Date",
//   characteristics: ["storyborn", "ally"],
//   text: "**PLUCKY PLAY** Whenever this character challenges another character, each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverChallengesAnotherChar({
//       name: "PLUCKY PLAY",
//       text: "Whenever this character challenges another character, each opponent loses 1 lore.",
//       effects: [eachOpponentLosesXLore(1)],
//     }),
//   ],
//   flavour: "He keeps his eye on the prize.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Francesco D'ippolito / Giuseppe di Maio",
//   number: 122,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561485,
//   },
//   rarity: "common",
// };
//
