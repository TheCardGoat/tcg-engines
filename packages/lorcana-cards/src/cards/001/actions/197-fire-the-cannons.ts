import type { ActionCard } from "@tcg/lorcana-types";

export const fireTheCannonsundefined: ActionCard = {
  id: "lhl",
  cardType: "action",
  name: "Fire the Cannons!",
  version: "undefined",
  fullName: "Fire the Cannons! - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "Deal 2 damage to chosen character.",
  cost: 1,
  cardNumber: 197,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "lhl-1",
      text: "Deal 2 damage to chosen character.",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const fireTheCannons: LorcanitoActionCard = {
//   id: "lhl",
//   reprints: ["ooh"],
//   name: "Fire the Cannons!",
//   characteristics: ["action"],
//   text: "Deal 2 damage to chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Fire the Cannons!",
//       text: "Deal 2 damage to chosen character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Captain Hook: „Double the powder and shorten the\rfuse!<br />Mr. Smee: „Shorten the powder and double the fuse!",
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Matt Chapman",
//   number: 197,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493483,
//   },
//   rarity: "common",
// };
//
