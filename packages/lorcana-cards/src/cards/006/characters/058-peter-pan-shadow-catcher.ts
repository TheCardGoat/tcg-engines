import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanShadowCatcher: CharacterCard = {
  id: "1q3",
  cardType: "character",
  name: "Peter Pan",
  version: "Shadow Catcher",
  fullName: "Peter Pan - Shadow Catcher",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
  cost: 4,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 58,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dfc8163cdbc129a82ce2ec3503e80504beae6599",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { exertChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const peterPanShadowCatcher: LorcanitoCharacterCard = {
//   id: "em6",
//   missingTestCase: true,
//   name: "Peter Pan",
//   title: "Shadow Catcher",
//   characteristics: ["storyborn", "hero"],
//   text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Gotcha!",
//       conditions: [duringYourTurn],
//       text: "During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
//       effects: [exertChosenOpposingCharacter],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Simone Buonfantino",
//   number: 58,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591995,
//   },
//   rarity: "uncommon",
// };
//
