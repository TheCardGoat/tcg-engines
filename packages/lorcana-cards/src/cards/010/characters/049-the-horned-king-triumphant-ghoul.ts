import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingTriumphantGhoul: CharacterCard = {
  id: "1f3",
  cardType: "character",
  name: "The Horned King",
  version: "Triumphant Ghoul",
  fullName: "The Horned King - Triumphant Ghoul",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b831740545b2d2cb2a770d2e9dabea11de92d522",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { cardsHaveLeftAnyPlayersDiscardThisTurn } from "@lorcanito/lorcana-engine/abilities/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theHornedKingTriumphantGhoul: LorcanitoCharacterCard = {
//   id: "y29",
//   missingTestCase: false, // Tests are written and documented
//   name: "The Horned King",
//   title: "Triumphant Ghoul",
//   characteristics: ["storyborn", "villain", "king", "sorcerer"],
//   text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Dev Madan",
//   number: 49,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659177,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "GRAND MACHINATIONS",
//       text: "During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
//       conditions: [
//         { type: "during-turn", value: "self" },
//         cardsHaveLeftAnyPlayersDiscardThisTurn,
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           modifier: "add",
//           amount: 2,
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
// };
//
