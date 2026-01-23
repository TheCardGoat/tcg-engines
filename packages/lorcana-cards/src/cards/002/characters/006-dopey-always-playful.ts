import type { CharacterCard } from "@tcg/lorcana-types";

export const dopeyAlwaysPlayful: CharacterCard = {
  id: "7r7",
  cardType: "character",
  name: "Dopey",
  version: "Always Playful",
  fullName: "Dopey - Always Playful",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1bf42885e3bfca3782dbf920f153ae8a775eaa03",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const dopeyAlwaysPlayful: LorcanitoCharacterCard = {
//   id: "zdu",
//   name: "Dopey",
//   title: "Always Playful",
//   characteristics: ["storyborn", "ally", "seven dwarfs"],
//   text: "**ODD ONE OUT** When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Odd One Out",
//       text: "When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["seven dwarfs"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "He's a real gem.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 6,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526384,
//   },
//   rarity: "uncommon",
// };
//
