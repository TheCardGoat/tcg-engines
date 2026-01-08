import type { ActionCard } from "@tcg/lorcana-types";

export const blastFromYourPast: ActionCard = {
  id: "1tj",
  cardType: "action",
  name: "Blast from Your Past",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "005",
  text: "Name a card. Return all character cards with that name from your discard to your hand.",
  actionSubtype: "song",
  cost: 6,
  cardNumber: 28,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eae624b967b48ff127a57526529e8f65e7e8db5e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const blastFromYourPast: LorcanitoActionCard = {
//   id: "zt6",
//   name: "Blast From Your Past",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\nName a card. Return all character cards with that name from your discard to your hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       nameACard: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "name-a-card",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   colors: ["amber"],
//   cost: 6,
//   illustrator: "Nicola Saviori",
//   number: 28,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561468,
//   },
//   rarity: "super_rare",
// };
//
