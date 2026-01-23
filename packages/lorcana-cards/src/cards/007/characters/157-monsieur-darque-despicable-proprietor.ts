import type { CharacterCard } from "@tcg/lorcana-types";

export const monsieurDarqueDespicableProprietor: CharacterCard = {
  id: "116",
  cardType: "character",
  name: "Monsieur D'Arque",
  version: "Despicable Proprietor",
  fullName: "Monsieur D'Arque - Despicable Proprietor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 157,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "85f3e4e008a5404dac4605d4891d9a90e91d2dcc",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   drawACard,
//   mayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const monsieurDArqueDespicableProprietor: LorcanitoCharacterCard = {
//   id: "m61",
//   name: "Monsieur D'Arque",
//   title: "Despicable Proprietor",
//   characteristics: ["storyborn", "villain"],
//   text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item to draw a card.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "I'VE COME TO COLLECT",
//       text: "Whenever this character quests, you may banish chosen item to draw a card.",
//       optional: true,
//       dependentEffects: true,
//       // resolveEffectsIndividually: true,
//       effects: [mayBanish(chosenItemOfYours), drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Kamil Murzyn",
//   number: 157,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619495,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
