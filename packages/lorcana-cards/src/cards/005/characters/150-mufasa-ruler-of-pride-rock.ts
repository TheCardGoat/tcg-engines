import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaRulerOfPrideRock: CharacterCard = {
  id: "163",
  cardType: "character",
  name: "Mufasa",
  version: "Ruler of Pride Rock",
  fullName: "Mufasa - Ruler of Pride Rock",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "005",
  text: "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.\nEVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.",
  cost: 8,
  strength: 4,
  willpower: 9,
  lore: 4,
  cardNumber: 150,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97ba44b060278c8f2f5f75a9a77b64ea977369c1",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mufasaRulerOfPrideRock: LorcanitoCharacterCard = {
//   id: "rlb",
//   name: "Mufasa",
//   title: "Ruler of Pride Rock",
//   characteristics: ["storyborn", "king", "mentor"],
//   text: "**A DELICATE BALANCE** When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand. **EVERYTHING THE LIGHT TOUCHES** Whenever this character quests, ready all cards in your inkwell.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "A DELICATE BALANCE",
//       text: "When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.",
//       resolveEffectsIndividually: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "inkwell" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 2,
//             random: true,
//             filters: [
//               { filter: "zone", value: "inkwell" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//     wheneverQuests({
//       name: "EVERYTHING THE LIGHT TOUCHES",
//       text: "Whenever this character quests, ready all cards in your inkwell.",
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "inkwell" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   colors: ["sapphire"],
//   cost: 8,
//   strength: 4,
//   willpower: 9,
//   lore: 4,
//   illustrator: "Jeanne Plouvez",
//   number: 150,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559156,
//   },
//   rarity: "legendary",
// };
//
