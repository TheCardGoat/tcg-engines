import type { ActionCard } from "@tcg/lorcana-types";

export const letItGo: ActionCard = {
  abilities: [],
  actionSubtype: "song",
  cardNumber: 163,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  id: "n1y",
  inkType: ["sapphire"],
  inkable: true,
  name: "Let It Go",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nPut chosen character into their player",
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
// Export const letItGo: LorcanitoActionCard = {
//   Id: "n1y",
//   Name: "Let It Go",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nPut chosen character into their player's inkwell facedown and exerted.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Let It Go",
//       Text: "Put chosen character into their player's inkwell facedown and exerted.",
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Exerted: true,
//           Target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "It's time to see what I can do<br />To test the limits and break through",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 5,
//   Illustrator: "Milica Celikovic",
//   Number: 163,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492997,
//   },
//   Rarity: "rare",
// };
//
