import type { ActionCard } from "@tcg/lorcana-types";

export const theFamilyMadrigal: ActionCard = {
  id: "ibc",
  cardType: "action",
  name: "The Family Madrigal",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 40,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "420231f6bb1e6544dc1575a7d7d4334232698cfb",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { theFamilyMadrigalAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const theFamilyMadrigal: LorcanitoActionCard = {
//   id: "pol",
//   name: "The Family Madrigal",
//   characteristics: ["song", "action"],
//   text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
//   type: "action",
//   abilities: [theFamilyMadrigalAbility],
//   inkwell: true,
//   colors: ["amber", "amethyst"],
//   cost: 5,
//   illustrator: "Juan Diego Leon",
//   number: 40,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619429,
//   },
//   rarity: "rare",
// };
//
