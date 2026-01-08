import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseSweetheartPrincess: CharacterCard = {
  id: "ofq",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Sweetheart Princess",
  fullName: "Minnie Mouse - Sweetheart Princess",
  inkType: ["amber"],
  set: "009",
  text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nBYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 5,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5812c94d096ef13f315d9acdc7694bd2e1352abc",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   supportAbility,
//   yourCharactersNamedGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const minnieMouseSweetheartPrincess: LorcanitoCharacterCard = {
//   id: "rcq",
//   name: "Minnie Mouse",
//   title: "Sweetheart Princess",
//   characteristics: ["dreamborn", "hero", "princess"],
//   text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nBYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Ellie Horie",
//   number: 5,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649954,
//   },
//   rarity: "super_rare",
//   abilities: [
//     yourCharactersNamedGain({
//       name: "Mickey Mouse",
//       ability: supportAbility,
//     }),
//     wheneverThisCharacterQuests({
//       name: "BYE BYE, NOW",
//       text: "Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "status", value: "exerted" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "gte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
