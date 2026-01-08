import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaRestaurantOwner: CharacterCard = {
  id: "6kc",
  cardType: "character",
  name: "Tiana",
  version: "Restaurant Owner",
  fullName: "Tiana - Restaurant Owner",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 16,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "17a9503bd48a90ee1ab532c11add850dbfa48460",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// // for tiana's effect, should remove and put into it's own var
// import type { TriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const tianaRestaurantOwner: LorcanitoCharacterCard = {
//   id: "mxx",
//   missingTestCase: true,
//   name: "Tiana",
//   title: "Restaurant Owner",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
//   type: "character",
//   abilities: [
//     {
//       type: "static-triggered",
//       name: "Special Reservation",
//       text: "Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
//       conditions: [{ type: "exerted" }],
//       trigger: {
//         on: "challenge",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//           ],
//         },
//       },
//       layer: {
//         type: "resolution",
//         responder: "opponent",
//         name: "Special Reservation",
//         text: "Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
//         optional: true,
//
//         unless: true,
//         costs: [{ type: "ink", amount: 3 }],
//         effects: [],
//         onCancelLayer: {
//           type: "resolution",
//           effects: [
//             {
//               type: "attribute",
//               attribute: "strength",
//               amount: 3,
//               modifier: "subtract",
//               duration: "turn",
//               target: {
//                 type: "card",
//                 value: "all",
//                 filters: [{ filter: "challenge", value: "attacker" }],
//               },
//             },
//           ],
//         },
//       },
//     } as TriggeredAbility,
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Marine Josephine",
//   number: 16,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588155,
//   },
//   rarity: "legendary",
// };
//
