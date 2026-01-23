import type { CharacterCard } from "@tcg/lorcana-types";

export const genieWonderfulTrickster: CharacterCard = {
  id: "1yx",
  cardType: "character",
  name: "Genie",
  version: "Wonderful Trickster",
  fullName: "Genie - Wonderful Trickster",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)\nYOUR REWARD AWAITS Whenever you play a card, draw a card.\nFORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 61,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff98a7d79dbd9e9dd50780105dea42edda741876",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const genieWonderfulTrickster: LorcanitoCharacterCard = {
//   id: "s3l",
//   name: "Genie",
//   title: "Wonderful Trickster",
//   characteristics: ["floodborn", "ally"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)\nYOUR REWARD AWAITS Whenever you play a card, draw a card.\nFORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Genie"),
//     wheneverPlays({
//       name: "Your Reward Awaits",
//       text: "Whenever you play a card, draw a card.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [{ filter: "owner", value: "self" }],
//       },
//       effects: [drawACard],
//     }),
//     atTheEndOfYourTurn({
//       name: "Forbidden Treasure",
//       text: "At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "move",
//           to: "deck",
//           bottom: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 4,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Mike Parker",
//   number: 61,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588084,
//   },
//   rarity: "legendary",
// };
//
