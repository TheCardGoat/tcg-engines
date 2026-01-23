import type { CharacterCard } from "@tcg/lorcana-types";

export const bernardBrandnewAgent: CharacterCard = {
  id: "15t",
  cardType: "character",
  name: "Bernard",
  version: "Brand-New Agent",
  fullName: "Bernard - Brand-New Agent",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  text: "I'LL CHECK IT OUT At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 2,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "96b509ea25a2dc6814d5ceedc225139dfbfaf703",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { ifThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const bernardBrandNewAgent: LorcanitoCharacterCard = {
//   id: "bzq",
//   missingTestCase: true,
//   name: "Bernard",
//   title: "Brand-New Agent",
//   characteristics: ["hero", "storyborn"],
//   text: "**I'LL CHECK IT OUT** At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
//   type: "character",
//   abilities: [
//     atTheEndOfYourTurn({
//       name: "I'll Check it Out",
//       text: "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
//       conditions: [ifThisCharacterIsExerted],
//       optional: true,
//       effects: readyAndCantQuest(chosenCharacterOfYours),
//     }),
//   ],
//   flavour: "You stay there. I'll look for scattered lore.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Jacob McAlister",
//   number: 2,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537218,
//   },
//   rarity: "rare",
// };
//
