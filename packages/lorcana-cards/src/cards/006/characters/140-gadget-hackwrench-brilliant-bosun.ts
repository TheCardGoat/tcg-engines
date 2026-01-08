import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchBrilliantBosun: CharacterCard = {
  id: "35v",
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Brilliant Bosun",
  fullName: "Gadget Hackwrench - Brilliant Bosun",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gadget Hackwrench.)\nMECHANICALLY SAVVY While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 140,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0b66351b877ceea82545c1ad0fa5559e4ca44113",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const gadgetHackwrenchBrilliantBosun: LorcanitoCharacterCard = {
//   id: "bdj",
//   name: "Gadget Hackwrench",
//   title: "Brilliant Bosun",
//   characteristics: ["floodborn", "ally", "inventor"],
//   text: "**Shift 4** \n\n**MECHANICALLY SAVVY** While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Gadget Hackwrench"),
//     whileConditionThisCharacterGains({
//       name: "MECHANICALLY SAVVY",
//       text: "While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "item" },
//             { filter: "owner", value: "self" },
//           ],
//           comparison: { operator: "gte", value: 3 },
//         },
//       ],
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "cost",
//             amount: 1,
//             modifier: "subtract",
//             duration: "static",
//             target: {
//               type: "card",
//               value: "all",
//               filters: [
//                 { filter: "owner", value: "self" },
//                 { filter: "type", value: "character" },
//                 { filter: "zone", value: "hand" },
//                 { filter: "characteristics", value: ["inventor"] },
//               ],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Alex Accorsi",
//   number: 140,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578189,
//   },
//   rarity: "super_rare",
// };
//
