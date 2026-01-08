import type { CharacterCard } from "@tcg/lorcana-types";

export const gantuExperiencedEnforcer: CharacterCard = {
  id: "3lm",
  cardType: "character",
  name: "Gantu",
  version: "Experienced Enforcer",
  fullName: "Gantu - Experienced Enforcer",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "007",
  text: "CLOSE ALL CHANNELS When you play this character, characters can't exert to sing songs until the start of your next turn.\nDON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn’t apply to singing songs.)",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 199,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0cf9ec8277220e1e3790acd6c84c33cd9edb0ceb",
  },
  abilities: [],
  classifications: ["Storyborn", "Alien", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { voicelessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { allCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   gainsAbilityEffect,
//   untilTheEndOfYourNextTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const gantuExperiencedEnforcer: LorcanitoCharacterCard = {
//   id: "t8l",
//   name: "Gantu",
//   title: "Experienced Enforcer",
//   characteristics: ["storyborn", "alien", "captain"],
//   text: "CLOSE ALL CHANNELS When you play this character, characters can’t exert to sing songs until the start of your next turn.\nDON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn’t apply to singing songs.)",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "CLOSE ALL CHANNELS",
//       text: "When you play this character, characters can't exert to sing songs until the start of your next turn.",
//       effects: [
//         untilTheEndOfYourNextTurn(
//           gainsAbilityEffect({
//             ability: voicelessAbility,
//             target: allCharacters,
//             duration: "next_turn",
//             until: true,
//           }),
//         ),
//       ],
//     }),
//     {
//       type: "static",
//       name: "DON'T GET ANY IDEAS",
//       text: "Each player pays 2 {I} more to play actions or items. (This doesn't apply to singing songs.)",
//       ability: "effects",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "cost",
//           amount: 2,
//           modifier: "add",
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: ["action", "item"] },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Heidi Neubauer",
//   number: 199,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618733,
//   },
//   rarity: "super_rare",
//   lore: 1,
// };
//
