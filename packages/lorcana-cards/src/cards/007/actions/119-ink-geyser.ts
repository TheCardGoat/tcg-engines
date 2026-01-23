import type { ActionCard } from "@tcg/lorcana-types";

export const inkGeyser: ActionCard = {
  id: "1ny",
  cardType: "action",
  name: "Ink Geyser",
  inkType: ["emerald", "sapphire"],
  franchise: "Lorcana",
  set: "007",
  text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
  cost: 3,
  cardNumber: 119,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4b8b8bbbaefeaf584e85192063ab4a5fce656af",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DynamicAmount,
//   ExertEffect,
//   LorcanitoActionCard,
//   MoveCardEffect,
//   ResolutionAbility,
//   TargetFilter,
// } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { CreateLayerForPlayer } from "@lorcanito/lorcana-engine/effects/effectTypes";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// const cardInInkwellYouOwn: TargetFilter[] = [
//   { filter: "zone", value: "inkwell" },
//   { filter: "owner", value: "self" },
// ];
//
// const opponentsInkwellCards: TargetFilter[] = [
//   { filter: "zone", value: "inkwell" },
//   { filter: "owner", value: "opponent" },
// ];
//
// const haveMoreThan3CardsInInkwell: Condition = {
//   type: "filter",
//   comparison: { operator: "gt", value: 3 },
//   filters: cardInInkwellYouOwn,
// };
//
// const untilYouHave3: DynamicAmount = {
//   dynamic: true,
//   filters: cardInInkwellYouOwn,
//   difference: 3,
//   invertDifference: true, // Return cards from inkwell: calculate (current_inkwell - 3)
// };
//
// const moveToHandUntilHave3: MoveCardEffect = {
//   type: "move",
//   to: "hand",
//   target: {
//     type: "card",
//     random: true,
//     filters: cardInInkwellYouOwn,
//     value: untilYouHave3,
//   },
// };
//
// const exertAllCardsInInkwell: ExertEffect = {
//   type: "exert",
//   exert: true,
//   target: {
//     type: "card",
//     value: "all",
//     filters: [{ filter: "zone", value: "inkwell" }],
//   },
// };
//
// const youReturnToHand: CreateLayerForPlayer = {
//   type: "create-layer-for-player",
//   target: self,
//   conditions: [haveMoreThan3CardsInInkwell],
//   layer: {
//     type: "resolution",
//     effects: [moveToHandUntilHave3],
//   },
// };
//
// const opponentReturnToHand: CreateLayerForPlayer = {
//   type: "create-layer-for-player",
//   target: self,
//   conditions: [
//     {
//       type: "filter",
//       comparison: { operator: "gt", value: 3 },
//       filters: opponentsInkwellCards,
//     },
//   ],
//   layer: {
//     type: "resolution",
//     effects: [
//       {
//         type: "move",
//         to: "hand",
//         target: {
//           type: "card",
//           random: true,
//           filters: opponentsInkwellCards,
//           value: {
//             dynamic: true,
//             filters: opponentsInkwellCards,
//             difference: 3,
//             invertDifference: true, // Return cards from inkwell: calculate (current_inkwell - 3)
//           },
//         },
//       },
//     ],
//   },
// };
//
// const inkGeyserAbility: ResolutionAbility[] = [
//   {
//     type: "resolution",
//     text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
//     effects: [exertAllCardsInInkwell, youReturnToHand, opponentReturnToHand],
//   },
// ];
//
// export const inkGeyser: LorcanitoActionCard = {
//   id: "jvg",
//   name: "Ink Geyser",
//   characteristics: ["action"],
//   text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
//   type: "action",
//   abilities: inkGeyserAbility,
//   inkwell: false,
//   colors: ["emerald", "sapphire"],
//   cost: 3,
//   illustrator: "Kevin Sidharta",
//   number: 119,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618175,
//   },
//   rarity: "rare",
// };
//
