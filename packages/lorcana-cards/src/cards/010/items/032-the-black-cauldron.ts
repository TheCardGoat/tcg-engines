import type { ItemCard } from "@tcg/lorcana-types";

export const theBlackCauldron: ItemCard = {
  id: "1ni",
  cardType: "item",
  name: "The Black Cauldron",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.\nRISE AND JOIN ME! {E}, 1 {I} – This turn, you may play characters from under this item.",
  cost: 3,
  cardNumber: 32,
  inkable: false,
  externalIds: {
    ravensburger: "d59bf7b77f401b3aeb48aef1f53706b3c0bc556a",
  },
  abilities: [
    {
      id: "1ni-1",
      text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.",
      name: "THE CAULDRON CALLS",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "put-under",
        source: "discard",
        under: "self",
        cardType: "character",
      },
    },
    {
      id: "1ni-2",
      text: "RISE AND JOIN ME! {E}, {d} {I} – This turn, you may play characters from under this item.",
      name: "RISE AND JOIN ME!",
      type: "activated",
      cost: {
        exert: true,
        ink: 0,
      },
      effect: {
        type: "enable-play-from-under",
        cardType: "character",
        duration: "this-turn",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { boostEffect } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { chosenCharacterCardFromYourDiscard } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theBlackCauldron: LorcanitoItemCard = {
//   id: "mna",
//   name: "The Black Cauldron",
//   characteristics: ["item"],
//   text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup. RISE AND JOIN ME! {E}, 1 {I} — This turn, you may play characters from under this item.",
//   type: "item",
//   inkwell: false,
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Kaitlin Cuthbertson",
//   number: 32,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657895,
//   },
//   rarity: "legendary",
//   abilities: [
//     {
//       type: "activated",
//       name: "THE CAULDRON CALLS",
//       text: "{E}, 1 — Put a character card from your discard under this item faceup.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         boostEffect({
//           amount: 1,
//           target: chosenCharacterCardFromYourDiscard,
//           faceUp: true,
//         }),
//       ],
//     },
//     {
//       type: "activated",
//       name: "RISE AND JOIN ME!",
//       text: "{E}, 1 {I} — This turn, you may play characters from under this item.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "play-permission",
//           sourceCardInstanceId: "", // Will be set at runtime by effectResolver
//           fromZone: "under-card",
//           duration: "turn",
//           target: {
//             type: "player",
//             value: "self",
//           },
//           cardFilters: [{ filter: "type", value: "character" }],
//         },
//       ],
//     },
//     {
//       type: "activated",
//       name: "PLAY CARDS UNDER",
//       text: "Play a character card from under this item.",
//       costs: [],
//       effects: [
//         {
//           type: "play-from-under",
//           optional: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//           amount: 1,
//           cardFilters: [{ filter: "type", value: "character" }],
//         },
//       ],
//     },
//   ],
// };
//
