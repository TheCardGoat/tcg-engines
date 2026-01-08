import type { ActionCard } from "@tcg/lorcana-types";

export const healingGlow: ActionCard = {
  id: "1ix",
  cardType: "action",
  name: "Healing Glow",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  text: "Remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 28,
  inkable: true,
  externalIds: {
    ravensburger: "c4353a13ff7ad0865ca1e7860a6c5feb8d15866d",
  },
  abilities: [
    {
      id: "1ix-1",
      text: "Remove up to 2 damage from chosen character.",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
        upTo: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const healingGlow: LorcanitoActionCard = {
//   id: "ta0",
//   name: "Healing Glow",
//   characteristics: ["action"],
//   text: "Remove up to 2 damage from chosen character.",
//   type: "action",
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Healing Glow",
//       text: "Remove up to 2 damage from chosen character.",
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
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
//   flavour: "Don't freak out! Rapunzel",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Philipp Kruse",
//   number: 28,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492713,
//   },
// };
//
