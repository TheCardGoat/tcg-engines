import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodSharpshooter: CharacterCard = {
  id: "1w7",
  cardType: "character",
  name: "Robin Hood",
  version: "Sharpshooter",
  fullName: "Robin Hood - Sharpshooter",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "005",
  text: "MY GREATEST PERFORMANCE Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 118,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f66d5ab4d3a54fec003c4f80526a7a6667ce7c86",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const robinHoodSharpshooter: LorcanitoCharacterCard = {
//   id: "zti",
//   name: "Robin Hood",
//   title: "Sharpshooter",
//   characteristics: ["hero", "storyborn"],
//   text: "**MY GREATEST PERFORMANCE** Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "My Greatest Performance",
//       text: "Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.",
//       effects: [
//         {
//           type: "scry",
//           mode: "discard",
//           shouldRevealTutored: true,
//           amount: 4,
//           target: self,
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "characteristics", value: ["action"] },
//             {
//               filter: "attribute",
//               value: "cost",
//               comparison: { operator: "lte", value: 6 },
//             },
//           ],
//           playFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "characteristics", value: ["action"] },
//             {
//               filter: "attribute",
//               value: "cost",
//               comparison: { operator: "lte", value: 6 },
//             },
//           ],
//           limits: {
//             play: 1,
//             bottom: 0,
//             top: 0,
//             hand: 0,
//             inkwell: 0,
//             discard: 4,
//           },
//         },
//       ],
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Federico Maria Cugliari",
//   number: 118,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561646,
//   },
//   rarity: "legendary",
// };
//
