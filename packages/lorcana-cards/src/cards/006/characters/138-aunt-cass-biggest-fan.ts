import type { CharacterCard } from "@tcg/lorcana-types";

export const auntCassBiggestFan: CharacterCard = {
  id: "1qq",
  cardType: "character",
  name: "Aunt Cass",
  version: "Biggest Fan",
  fullName: "Aunt Cass - Biggest Fan",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e21945b3edba79d71ce6d25e5a756f1a97ba9337",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const auntCassBiggestFan: LorcanitoCharacterCard = {
//   id: "q8p",
//   missingTestCase: true,
//   name: "Aunt Cass",
//   title: "Biggest Fan",
//   characteristics: ["storyborn", "mentor"],
//   text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Happy to Help",
//       text: "Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["inventor"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 138,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591989,
//   },
//   rarity: "common",
// };
//
