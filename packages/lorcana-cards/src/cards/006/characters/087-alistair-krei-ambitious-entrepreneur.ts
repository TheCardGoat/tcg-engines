import type { CharacterCard } from "@tcg/lorcana-types";

export const alistairKreiAmbitiousEntrepreneur: CharacterCard = {
  id: "ppn",
  cardType: "character",
  name: "Alistair Krei",
  version: "Ambitious Entrepreneur",
  fullName: "Alistair Krei - Ambitious Entrepreneur",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5caba947c087604d4db6f1463a4c61faab71effb",
  },
  abilities: [],
  classifications: ["Storyborn", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const alistairKreiAmbitiousEntrepreneur: LorcanitoCharacterCard = {
//   id: "v7y",
//   missingTestCase: true,
//   name: "Alistair Krei",
//   title: "Ambitious Entrepreneur",
//   characteristics: ["storyborn", "inventor"],
//   text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "An Eye For Tech",
//       text: "When you play this character, if an opponent has an item in play, gain 1 lore.",
//       effects: [youGainLore(1)],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Diogo Saito",
//   number: 87,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588368,
//   },
//   rarity: "common",
// };
//
