import type { ActionCard } from "@tcg/lorcana-types";

export const treasuresUntold: ActionCard = {
  id: "5db",
  cardType: "action",
  name: "Treasures Untold",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Return up to 2 item cards from your discard into your hand.",
  actionSubtype: "song",
  cost: 6,
  cardNumber: 165,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "135aa9bfe3b17939d13110d36bbbf5603ca9d681",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const treasuresUntold: LorcanitoActionCard = {
//   id: "pzn",
//   name: "Treasures Untold",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\n\n\nReturn up to 2 item cards from your discard into your hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Return up to 2 item cards from your discard into your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 2,
//             upTo: true,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "How many wonders can one cavern hold?",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   illustrator: "Matt Gaser",
//   number: 165,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547772,
//   },
//   rarity: "rare",
// };
//
