import type { ItemCard } from "@tcg/lorcana-types";

export const inkAmplifier: ItemCard = {
  id: "1gc",
  cardType: "item",
  name: "Ink Amplifier",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "010",
  text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bcc3489fe6383dec57016732d9934c6102fcd605",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { opponentHasDrawnXCardsThisTurn } from "@lorcanito/lorcana-engine/abilities/conditions";
// import { wheneverOpponentDrawsACard } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const inkAmplifier: LorcanitoItemCard = {
//   id: "peg",
//   name: "Ink Amplifier",
//   characteristics: ["item"],
//   text: "ENERGY CAPTURE Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "item",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Puny Bubble",
//   number: 167,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658883,
//   },
//   rarity: "rare",
//   abilities: [
//     wheneverOpponentDrawsACard({
//       name: "Energy Capture",
//       text: "Whenever an opponent draws a card during their turn, if it's the second card they've drawn this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       conditions: [
//         { type: "during-turn", value: "opponent" },
//         opponentHasDrawnXCardsThisTurn(2),
//       ],
//     }),
//   ],
// };
//
