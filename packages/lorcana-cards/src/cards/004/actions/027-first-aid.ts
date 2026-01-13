import type { ActionCard } from "@tcg/lorcana-types";

export const firstAid: ActionCard = {
  id: "1ha",
  cardType: "action",
  name: "First Aid",
  inkType: ["amber"],
  set: "004",
  text: "Remove up to 1 damage from each of your characters.",
  cost: 1,
  cardNumber: 27,
  inkable: true,
  externalIds: {
    ravensburger: "c0a5e3fc4e2e37085c62af71ef02f6136af750d2",
  },
  abilities: [
    {
      id: "1ha-1",
      text: "Remove up to 3 damage from each of your characters.",
      name: "Hakuna Matata",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        target: {
          selector: "all",
          owner: "you",
          count: "all",
        },
        upTo: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { eachOfYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const firstAid: LorcanitoActionCard = {
//   id: "r1q",
//   missingTestCase: true,
//   name: "First Aid",
//   characteristics: ["action"],
//   text: "Remove up to 1 damage from each of your characters.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Remove up to 1 damage from each of your characters.",
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: eachOfYourCharacters,
//         },
//       ],
//     },
//   ],
//   flavour: "There, now - isn't that better?",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Gonzalo Kenny",
//   number: 27,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550563,
//   },
//   rarity: "common",
// };
//
