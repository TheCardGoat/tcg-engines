import type { ActionCard } from "@tcg/lorcana-types";

export const motherKnowsBest: ActionCard = {
  id: "rxk",
  cardType: "action",
  name: "Mother Knows Best",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this\nsong for free.)_\nReturn chosen character to their player",
  cost: 3,
  actionSubtype: "song",
  cardNumber: 95,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// export const motherKnowsBest: LorcanitoActionCard = {
//   id: "rxk",
//   reprints: ["px0"],
//   name: "Mother Knows Best",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 3 or more can {E} to sing this\nsong for free.)_\nReturn chosen character to their player's hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Mother Knows Best",
//       text: "Return chosen character to their player's hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "One way or another \nSomething will go wrong, I swear",
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "R. La Barbera / L. Giammichele",
//   number: 95,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506100,
//   },
//   rarity: "uncommon",
// };
//
