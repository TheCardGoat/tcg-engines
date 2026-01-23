import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseFriendlyFace: CharacterCard = {
  id: "1xe",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Friendly Face",
  fullName: "Mickey Mouse - Friendly Face",
  inkType: ["amber"],
  set: "002",
  franchise: "Mickey Mouse & Friends",
  text: "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
  cost: 6,
  strength: 1,
  willpower: 6,
  lore: 3,
  cardNumber: 13,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f997fdb38a0d507a4edd3974df237ad743eb46f7",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mickeyMouseFriendlyFace: LorcanitoCharacterCard = {
//   id: "ll5",
//   name: "Mickey Mouse",
//   title: "Friendly Face",
//   characteristics: ["hero", "storyborn"],
//   text: "**GLAD YOU'RE HERE!** Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Glad You're Here!",
//       text: "Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "next",
//           amount: 3,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "type", value: "character" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Come on in−there's lots to explore.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 1,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
//   number: 13,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516384,
//   },
//   rarity: "super_rare",
// };
//
