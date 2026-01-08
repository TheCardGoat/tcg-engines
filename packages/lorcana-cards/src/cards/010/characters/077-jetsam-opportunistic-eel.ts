import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamOpportunisticEel: CharacterCard = {
  id: "1vu",
  cardType: "character",
  name: "Jetsam",
  version: "Opportunistic Eel",
  fullName: "Jetsam - Opportunistic Eel",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f47ed6460876358001084645e206b193f75cad8e",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const jetsamOpportunisticEel: LorcanitoCharacterCard = {
//   id: "gph",
//   name: "Jetsam",
//   title: "Opportunistic Eel",
//   characteristics: ["storyborn", "ally"],
//   text: "AMBUSH FROM THE DEEP When you play this character, deal 3 damage to chosen opposing damaged character.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 6,
//   willpower: 6,
//   illustrator: "Ricardo Contia",
//   number: 77,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659462,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "AMBUSH FROM THE DEEP",
//       text: "When you play this character, deal 3 damage to chosen opposing damaged character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 3,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               { filter: "status", value: "damaged" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
