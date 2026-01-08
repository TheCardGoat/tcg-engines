import type { ActionCard } from "@tcg/lorcana-types";

export const riseOfTheTitans: ActionCard = {
  id: "68m",
  cardType: "action",
  name: "Rise of the Titans",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Banish chosen location or item.",
  cost: 3,
  cardNumber: 198,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "167ce3ffa872b248ed98311ea3be37caf99525c5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   BanishEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
//
// export const riseOfTheTitans: LorcanitoActionCard = {
//   id: "ukw",
//   name: "Rise of the Titans",
//   characteristics: ["action"],
//   text: "Banish chosen location or item.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Rise of the Titans",
//       text: "Banish chosen location or item.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["location", "item"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         } as BanishEffect,
//       ],
//     },
//   ],
//   flavour: "Oh, we're in trouble, big trouble! \n–Hermes",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Nicola Saviori",
//   number: 198,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537609,
//   },
//   rarity: "uncommon",
// };
//
