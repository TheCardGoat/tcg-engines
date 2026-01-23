import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaTrustedSister: CharacterCard = {
  id: "yr0",
  cardType: "character",
  name: "Elsa",
  version: "Trusted Sister",
  fullName: "Elsa - Trusted Sister",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "007",
  text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 55,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7d3e568c2cd7e015fe10f8fd4df6d76439d11d52",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const elsaTrustedSister: LorcanitoCharacterCard = {
//   id: "tg7",
//   name: "Elsa",
//   title: "Trusted Sister",
//   characteristics: ["storyborn", "hero", "queen", "sorcerer"],
//   text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "WHAT DO WE DO NOW?",
//       text: "Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: {
//             operator: "gte",
//             value: 1,
//           },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "Anna" },
//             },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 1,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Amber Koomanvonpa",
//   number: 55,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619434,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
