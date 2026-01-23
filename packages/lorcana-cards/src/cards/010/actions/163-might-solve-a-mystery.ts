import type { ActionCard } from "@tcg/lorcana-types";

export const mightSolveAMystery: ActionCard = {
  id: "16a",
  cardType: "action",
  name: "Might Solve a Mystery",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "010",
  text: "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 163,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97e957a0218674c1311025733096078b5b727f1a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoActionCard,
//   ResolutionAbility,
//   ScryEffect,
// } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const mightSolveAmysteryScry: ScryEffect = {
//   type: "scry",
//   amount: 4,
//   mode: "bottom",
//   shouldRevealTutored: true,
//   target: self,
//   tutorFilters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "deck" },
//   ],
//   limits: {
//     bottom: 4,
//     hand: [
//       {
//         type: "card",
//         value: 1,
//         filters: [{ filter: "type", value: "character" }],
//       },
//       {
//         type: "card",
//         value: 1,
//         filters: [{ filter: "type", value: "item" }],
//       },
//     ],
//   },
// };
//
// export const mightSolveAMysteryAbility: ResolutionAbility = {
//   type: "resolution",
//   name: "Might Solve a Mystery",
//   text: "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.",
//   effects: [mightSolveAmysteryScry],
// };
//
// export const mightSolveAMystery: LorcanitoActionCard = {
//   id: "r8q",
//   name: "Might Solve a Mystery",
//   characteristics: ["action", "song"],
//   text: "Look at the top 4 cards of your deck. You may reveal up to 1 character card and up to 1 item card and put them into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "action",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Rachel Elese",
//   number: 163,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658459,
//   },
//   rarity: "uncommon",
//   abilities: [mightSolveAMysteryAbility],
// };
//
