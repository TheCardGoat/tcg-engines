import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiScientificSupervillain: CharacterCard = {
  id: "11l",
  cardType: "character",
  name: "Yokai",
  version: "Scientific Supervillain",
  fullName: "Yokai - Scientific Supervillain",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
  cost: 9,
  strength: 6,
  willpower: 10,
  lore: 2,
  cardNumber: 160,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8786d1eedf8f662d74c12dfd082d6ab631d01a63",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yokaiScientificSupervillain: LorcanitoCharacterCard = {
//   id: "lrm",
//   missingTestCase: true,
//   name: "Yokai",
//   title: "Scientific Supervillain",
//   characteristics: ["floodborn", "villain", "inventor"],
//   text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
//   type: "character",
//   abilities: [
//     shiftAbility(6, "Yokai"),
//     {
//       type: "static",
//       ability: "effects",
//       name: "Neurotransmitter",
//       text: "You may play items named Microbots for free.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "cost",
//           amount: 99,
//           modifier: "subtract",
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "hand" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Microbots" },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     wheneverQuests({
//       name: "Technical Gain",
//       text: "Whenever this character quests, draw a card for each opposing character with 0 {S}.",
//       effects: [
//         drawXCards({
//           dynamic: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "opponent" },
//             {
//               filter: "attribute",
//               value: "strength",
//               comparison: { operator: "eq", value: 0 },
//             },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 9,
//   strength: 6,
//   willpower: 10,
//   lore: 2,
//   illustrator: "Nicola Saviori",
//   number: 160,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588333,
//   },
//   rarity: "rare",
// };
//
