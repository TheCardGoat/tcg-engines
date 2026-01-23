import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckFirstMate: CharacterCard = {
  id: "1rl",
  cardType: "character",
  name: "Donald Duck",
  version: "First Mate",
  fullName: "Donald Duck - First Mate",
  inkType: ["emerald"],
  set: "006",
  text: "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 80,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e534e9076f10a41b2d0332d7612419ea08d5de99",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { haveCaptainInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const donaldDuckFirstMate: LorcanitoCharacterCard = {
//   id: "hqe",
//   name: "Donald Duck",
//   title: "First Mate",
//   characteristics: ["dreamborn", "hero", "pirate"],
//   text: "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Captain On Deck",
//       text: "While you have a Captain character in play, this character gets +2 {L}.",
//       conditions: [haveCaptainInPlay],
//       attribute: "lore",
//       amount: 2,
//     }),
//     {
//       type: "static",
//       ability: "effects",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "quest",
//           duration: "static",
//           until: true,
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jochem van Gool",
//   number: 80,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593002,
//   },
//   rarity: "uncommon",
// };
//
