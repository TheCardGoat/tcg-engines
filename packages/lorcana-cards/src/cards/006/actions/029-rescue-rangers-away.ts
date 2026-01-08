import type { ActionCard } from "@tcg/lorcana-types";

export const rescueRangersAway: ActionCard = {
  id: "1eh",
  cardType: "action",
  name: "Rescue Rangers Away!",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
  cost: 2,
  cardNumber: 29,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b5b569d97b7b26cd822613b9016587fc87dfb990",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rescueRangersAway: LorcanitoActionCard = {
//   id: "fhc",
//   name: "Rescue Rangers Away!",
//   characteristics: ["action"],
//   text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Rescue Rangers Away!",
//       text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//
//   illustrator: "Mariana Moreno",
//   number: 29,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578172,
//   },
//   rarity: "uncommon",
// };
//
