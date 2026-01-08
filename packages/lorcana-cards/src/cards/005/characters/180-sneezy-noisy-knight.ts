import type { CharacterCard } from "@tcg/lorcana-types";

export const sneezyNoisyKnight: CharacterCard = {
  id: "83h",
  cardType: "character",
  name: "Sneezy",
  version: "Noisy Knight",
  fullName: "Sneezy - Noisy Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "HEADWIND When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 180,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1d2e270230ea5591f099ec13cd86985cbd578105",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const sneezyNoisyKnight: LorcanitoCharacterCard = {
//   id: "tkh",
//   missingTestCase: true,
//   name: "Sneezy",
//   title: "Noisy Knight",
//   characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   text: "**HEADWIND** When you play this character, chosen Knight character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Headwind",
//       text: "When you play this character, chosen Knight character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "characteristics", value: ["knight"] },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 180,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559663,
//   },
//   rarity: "common",
// };
//
