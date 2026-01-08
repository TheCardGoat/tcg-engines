import type { ActionCard } from "@tcg/lorcana-types";

export const hideAway: ActionCard = {
  id: "12i",
  cardType: "action",
  name: "Hide Away",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "Put chosen item or location into its player's inkwell facedown and exerted.",
  cost: 2,
  cardNumber: 163,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a4b79dfce8cd5ce2a263af63f7f8a57679803ca",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const hideAway: LorcanitoActionCard = {
//   id: "cyn",
//   missingTestCase: true,
//   name: "Hide Away",
//   characteristics: ["action"],
//   text: "Put chosen item or location into its player’s inkwell facedown and exerted.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Put chosen item or location into its player’s inkwell facedown and exerted.",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["item", "location"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     'Fauna: "Oh my! We dropped some . . ."\nMerryweather: "You mean you dropped some!"',
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Mike Parker",
//   number: 163,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561653,
//   },
//   rarity: "uncommon",
// };
//
