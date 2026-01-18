import type { ActionCard } from "@tcg/lorcana-types";
import { dealDamage } from "../../ability-helpers";

export const grabYourSword: ActionCard = {
  id: "fa7",
  cardType: "action",
  name: "Grab Your Sword",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Deal 2 damage to each opposing character.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 198,
  inkable: false,
  externalIds: {
    ravensburger: "371502073092025bab3c49038c7809151c636ad4",
  },
  abilities: [
    {
      id: "fa7-1",
      text: "Deal 2 damage to each opposing character.",
      type: "action",
      effect: dealDamage(2, "ALL_OPPOSING_CHARACTERS"),
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const grabYourSword: LorcanitoActionCard = {
//   id: "u4k",
//   name: "Grab Your Sword",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nDeal 2 damage to each opposing character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Grab Your Sword",
//       text: "Deal 2 damage to each opposing character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "We don't like\nwhat we don't understand\nIn fact, it scares us",
//   colors: ["steel"],
//   cost: 5,
//   illustrator: "Peter Brockhammer",
//   number: 198,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503469,
//   },
//   rarity: "rare",
// };
//
