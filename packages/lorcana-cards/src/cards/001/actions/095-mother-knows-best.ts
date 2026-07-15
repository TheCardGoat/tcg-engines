import type { ActionCard } from "@tcg/lorcana-types";

export const motherKnowsBest: ActionCard = {
  abilities: [],
  actionSubtype: "song",
  cardNumber: 95,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  id: "rxk",
  inkType: ["emerald"],
  inkable: true,
  name: "Mother Knows Best",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this\nsong for free.)_\nReturn chosen character to their player",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const chosenCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// Export const motherKnowsBest: LorcanitoActionCard = {
//   Id: "rxk",
//   Reprints: ["px0"],
//   Name: "Mother Knows Best",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 3 or more can {E} to sing this\nsong for free.)_\nReturn chosen character to their player's hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Mother Knows Best",
//       Text: "Return chosen character to their player's hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   Flavour: "One way or another \nSomething will go wrong, I swear",
//   Colors: ["emerald"],
//   Cost: 3,
//   Illustrator: "R. La Barbera / L. Giammichele",
//   Number: 95,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506100,
//   },
//   Rarity: "uncommon",
// };
//
