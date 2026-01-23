import type { ActionCard } from "@tcg/lorcana-types";

export const weCouldBeImmortals: ActionCard = {
  id: "ulc",
  cardType: "action",
  name: "We Could Be Immortals",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted. (Damage dealt to them is reduced by 6.)",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 162,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6e428663c224995945b62be7fe69cd44cbb42939",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const weCouldBeImmortals: LorcanitoActionCard = {
//   id: "nb5",
//   name: "We Could Be Immortals",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\nYour Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "We Could Be Immortals",
//       text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 6,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["inventor"] },
//             ],
//           },
//         },
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   lore: 6,
//   illustrator: "Ian MacDonald",
//   number: 162,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578844,
//   },
//   rarity: "rare",
// };
//
