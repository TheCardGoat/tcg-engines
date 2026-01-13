import type { CharacterCard } from "@tcg/lorcana-types";

export const goliathClanLeader: CharacterCard = {
  id: "1uq",
  cardType: "character",
  name: "Goliath",
  version: "Clan Leader",
  fullName: "Goliath - Clan Leader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "f07d182b4a436bccc39687b73bb55f1ffa3fce96",
  },
  abilities: [
    {
      id: "1uq-1",
      name: "DUSK TO DAWN",
      text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        timing: "at",
        on: "ANY_PLAYER",
      },
      effect: {
        type: "sequence",
        steps: [],
      },
    },
    {
      id: "1uq-2",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      condition: {
        type: "if",
        expression: "you have 3 or more cards in your hand",
      },
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheEndOfTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
// import {
//   discardCardsUntilYouHaveXCardsInHand,
//   drawCardsUntilYouHaveXCardsInHand,
// } from "@lorcanito/lorcana-engine/effects/effects";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// function moreThanTwoCardsInHand(player: "self" | "opponent"): Condition {
//   return {
//     type: "filter",
//     filters: [
//       { filter: "zone", value: "hand" },
//       { filter: "owner", value: player },
//     ],
//     comparison: { operator: "gt", value: 2 },
//   };
// }
//
// function fewerThanTwoCardsInHand(player: "self" | "opponent"): Condition {
//   return {
//     type: "filter",
//     filters: [
//       { filter: "zone", value: "hand" },
//       { filter: "owner", value: player },
//     ],
//     comparison: { operator: "lt", value: 2 },
//   };
// }
//
// function moreOrLessThanTwoCardsInHand(player: "self" | "opponent"): Condition {
//   // True when hand size != 2
//   return {
//     type: "filter",
//     filters: [
//       { filter: "zone", value: "hand" },
//       { filter: "owner", value: player },
//     ],
//     comparison: { operator: "eq", value: 2 },
//     negate: true,
//   };
// }
//
// export const goliathClanLeader: LorcanitoCharacterCard = {
//   id: "hkv",
//   name: "Goliath",
//   title: "Clan Leader",
//   characteristics: ["dreamborn", "hero", "gargoyle"],
//   text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 6,
//   willpower: 5,
//   illustrator: "Valerio Buonfantino",
//   number: 173,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658496,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [
//     // Self: create a single conditional layer that discards down to 2 or draws up to 2
//     atTheEndOfTurn({
//       target: self,
//       name: "DUSK TO DAWN",
//       text: "At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
//       conditions: [moreOrLessThanTwoCardsInHand("self")],
//       effects: [
//         {
//           type: "create-layer-based-on-condition",
//           target: self,
//           conditionalEffects: [
//             {
//               conditions: [moreThanTwoCardsInHand("self")],
//               effects: [discardCardsUntilYouHaveXCardsInHand(2, "self")],
//             },
//             {
//               conditions: [fewerThanTwoCardsInHand("self")],
//               effects: [drawCardsUntilYouHaveXCardsInHand(2, self)],
//             },
//           ],
//         },
//       ],
//     }),
//     // opponent: create a single conditional layer that discards down to 2 or draws up to 2
//     atTheEndOfTurn({
//       target: opponent,
//       name: "DUSK TO DAWN",
//       text: "At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
//       conditions: [moreOrLessThanTwoCardsInHand("opponent")],
//       effects: [
//         {
//           type: "create-layer-based-on-condition",
//           target: opponent,
//           conditionalEffects: [
//             {
//               conditions: [moreThanTwoCardsInHand("opponent")],
//               effects: [discardCardsUntilYouHaveXCardsInHand(2, "self")], // self = opponent here
//             },
//             {
//               conditions: [fewerThanTwoCardsInHand("opponent")],
//               effects: [drawCardsUntilYouHaveXCardsInHand(2, self)], // self = opponent here
//             },
//           ],
//         },
//       ],
//     }),
//     stoneByDayAbility,
//   ],
// };
//
