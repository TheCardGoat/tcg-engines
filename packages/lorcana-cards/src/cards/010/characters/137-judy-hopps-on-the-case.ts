import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsOnTheCase: CharacterCard = {
  id: "1wm",
  cardType: "character",
  name: "Judy Hopps",
  version: "On the Case",
  fullName: "Judy Hopps - On the Case",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 137,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f760ca3cb8bc2c4a984a4d6cf91c485ee8a9881d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenItem } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const judyHoppsOnTheCase: LorcanitoCharacterCard = {
//   id: "zeq",
//   missingTestCase: true,
//   name: "Judy Hopps",
//   title: "On the Case",
//   characteristics: ["storyborn", "hero", "detective"],
//   text: "HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Andrew Chesworth",
//   number: 137,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659617,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     whenYouPlayThis({
//       name: "HIDDEN CLUES",
//       text: "If you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.",
//       optional: true,
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "characteristics", value: ["detective"] },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//           ],
//           comparison: { operator: "gte", value: 2 },
//         },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenItem,
//         },
//       ],
//     }),
//   ],
// };
//
