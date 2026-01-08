import type { CharacterCard } from "@tcg/lorcana-types";

export const annaIceBreaker: CharacterCard = {
  id: "pj2",
  cardType: "character",
  name: "Anna",
  version: "Ice Breaker",
  fullName: "Anna - Ice Breaker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nWINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5c027c79eedd9a761d4497187cd38ba25c697de4",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const annaIceBreaker: LorcanitoCharacterCard = {
//   id: "ctd",
//   name: "Anna",
//   title: "Ice Breaker",
//   characteristics: ["dreamborn", "hero", "queen", "sorcerer"],
//   text: "Support\nWINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
//   type: "character",
//   abilities: [
//     supportAbility,
//     {
//       type: "resolution",
//       name: "WINTER AMBUSH",
//       text: "When you play this character, chosen opposing character can't ready at the start of their next turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "ready-at-start-of-turn",
//           duration: "next_turn",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//
//   colors: ["amethyst", "sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Ian MacDonald",
//   number: 72,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619444,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
