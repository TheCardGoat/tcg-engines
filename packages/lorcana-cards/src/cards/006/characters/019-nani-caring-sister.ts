import type { CharacterCard } from "@tcg/lorcana-types";

export const naniCaringSister: CharacterCard = {
  id: "1fu",
  cardType: "character",
  name: "Nani",
  version: "Caring Sister",
  fullName: "Nani - Caring Sister",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nI AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "badb6313c16d779154ca8614bade62b8ebaaafee",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const naniCaringSister: LorcanitoCharacterCard = {
//   id: "m9x",
//   missingTestCase: true,
//   name: "Nani",
//   title: "Caring Sister",
//   characteristics: ["storyborn", "hero"],
//   text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nI AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     supportAbility,
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 2 }],
//       name: "I Am So Sorry",
//       text: "Chosen character gets -1 {S} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           target: chosenCharacter,
//           until: true,
//           duration: "next_turn",
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Carmine Pucci",
//   number: 19,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592005,
//   },
//   rarity: "rare",
// };
//
