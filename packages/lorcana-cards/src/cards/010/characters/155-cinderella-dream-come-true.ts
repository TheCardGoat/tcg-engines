import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaDreamComeTrue: CharacterCard = {
  id: "1sh",
  cardType: "character",
  name: "Cinderella",
  version: "Dream Come True",
  fullName: "Cinderella - Dream Come True",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "010",
  text: "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 155,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e866de1be3c67d16a9bbd3aa5af3e00ab4bccac5",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   TargetFilter,
// } from "@lorcanito/lorcana-engine";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import {
//   drawXCards,
//   putChosenCardFromYourHandIntoYourInkwellExerted,
// } from "@lorcanito/lorcana-engine/effects/effects";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// const filters: TargetFilter[] = [
//   { filter: "characteristics", value: ["princess"] },
// ];
//
// const playedPrincessCharacterThisTurnCondition: Condition = {
//   type: "played-card",
//   filters,
//   comparison: { operator: "gte", value: 1 },
// };
//
// const putCardFromHandIntoInkwellEffect = {
//   ...putChosenCardFromYourHandIntoYourInkwellExerted,
//   exerted: false,
// };
//
// export const cinderellaDreamComeTrue: LorcanitoCharacterCard = {
//   id: "h2j",
//   name: "Cinderella",
//   title: "Dream Come True",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
//   type: "character",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Brittney Hackett",
//   number: 155,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658344,
//   },
//   rarity: "legendary",
//   lore: 1,
//   abilities: [
//     atTheEndOfYourTurn({
//       name: "WHATEVER YOU WISH FOR",
//       text: "At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
//       conditions: [playedPrincessCharacterThisTurnCondition],
//       optional: true,
//       effects: [putCardFromHandIntoInkwellEffect, drawXCards(1)],
//     }),
//   ],
// };
//
