import type { CharacterCard } from "@tcg/lorcana-types";

export const vladimirCeramicUnicornFan: CharacterCard = {
  id: "j0l",
  cardType: "character",
  name: "Vladimir",
  version: "Ceramic Unicorn Fan",
  fullName: "Vladimir - Ceramic Unicorn Fan",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "44893592a58c77ecae29739f2439ac935a0ee03b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const vladimirCeramicUnicornFan: LorcanitoCharacterCard = {
//   id: "w8v",
//   name: "Vladimir",
//   title: "Ceramic Unicorn Fan",
//   characteristics: ["storyborn", "ally"],
//   text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Jochem van Gool",
//   number: 75,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658879,
//   },
//   rarity: "common",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "HIGH STANDARDS",
//       text: "Whenever this character quests, you may banish chosen item.",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
