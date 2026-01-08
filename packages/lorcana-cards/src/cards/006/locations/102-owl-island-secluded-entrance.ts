import type { LocationCard } from "@tcg/lorcana-types";

export const owlIslandSecludedEntrance: LocationCard = {
  id: "y11",
  cardType: "location",
  name: "Owl Island",
  version: "Secluded Entrance",
  fullName: "Owl Island - Secluded Entrance",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "006",
  text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 102,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7aa47d85c7274b41667c57cd8ebefe2dbe00b83c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { actionCardsInHand } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const owlIslandSecludedEntrance: LorcanitoLocationCard = {
//   id: "ox9",
//   name: "Owl Island",
//   title: "Secluded Entrance",
//   characteristics: ["location"],
//   text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
//   type: "location",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Teamwork",
//       text: "For each character you have here, you pay 1 {I} less for the first action you play each turn.",
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//         },
//         { type: "played-actions", comparison: { operator: "eq", value: 0 } },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "cost",
//           amount: {
//             dynamic: true,
//             sourceAttribute: "chars-at-location",
//           },
//           modifier: "subtract",
//           duration: "static",
//           target: actionCardsInHand,
//         },
//       ],
//     },
//     wheneverPlays({
//       name: "Lots to Learn",
//       text: "Whenever you play a second action in a turn, gain 3 lore.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "turn",
//             value: "played",
//             targetFilter: [{ filter: "type", value: "action" }],
//             comparison: { operator: "eq", value: 2 },
//           },
//         ],
//       },
//       effects: [youGainLore(3)],
//     }),
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 3,
//   willpower: 6,
//   moveCost: 1,
//   illustrator: "Alex Accorsi",
//   number: 102,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593034,
//   },
//   rarity: "rare",
// };
//
